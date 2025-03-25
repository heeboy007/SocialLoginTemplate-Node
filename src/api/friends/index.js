import express from 'express';
import friendsController from './friends.controller.js';

const friendsRouter = express.Router();

friendsRouter.get('/getFriendsAvatar', friendsController.getFriendsAvatar)
friendsRouter.get('/getFriendsAvatarView', friendsController.getFriendsAvatarView)
friendsRouter.get('/getRecommendedFriendsAvatarView', friendsController.getRecommendedFriendsAvatarView)
friendsRouter.post('/addFriend', friendsController.addFriend)

export { friendsRouter };