const {serveStatic} = require('utils');
const Router = require('@koa/router');
const path = require('path');
// const User = require('mongo/models/User').User;
const mongoose = require('mongoose');
const _ = require('lodash');

const router = new Router({
  prefix: '/users'
});

const getPath = str => path.resolve(__dirname, str);

router
  .param('userById', async (id, ctx, next) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.throw(404, 'Invalid ID');
    }
    ctx.userById = await User.findById(id);
    if (!ctx.userById) {
      ctx.throw(404, 'Not found');
    }
    await next();
  })
  .get('/', async ctx => {
    const users = await User.find({});

    serveStatic(ctx.app, getPath('static'));
    ctx.body = ctx.render('users', {
      title: 'Test users CRUD mongoose',
      users: users.map(user => user.toObject())
    });
  })
  .get('/:userById', async ctx => {
    ctx.body = ctx.userById.toObject();
  })
  .post('/', async ctx => {
    const body = ctx.request.body;
    try {
      await User.create(_.pick(body, User.publickFields));
      ctx.body = {
        name: body.name,
        email: body.email
      };
    } catch (e) {
      if (e.name !== 'ValidationError') throw e;
      const customErr = Object.entries(e.errors).reduce((prev, [column, meta]) => {
        prev = {
          [column]: meta.message
        };
        return prev;
      }, {});
      ctx.throw(400, JSON.stringify(customErr));
    }
  })
  .patch('/:userById', async ctx => {
    const body = ctx.request.body;
    await ctx.userById.update(_.pick(ctx.request.body, User.publickFields));
    ctx.body = {
      id: ctx.userById.id,
      name: body.name,
      email: body.email
    };
  })
  .del('/:userById', async ctx => {
    await ctx.userById.remove();
    ctx.status = 200;
  });

module.exports = router;
