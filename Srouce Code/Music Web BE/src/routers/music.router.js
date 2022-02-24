const express = require('express');
const { MusicController } = require('../controllers');
const MusicRouter = express.Router();

MusicRouter.get('/', MusicController.asyncGetAllMusic.bind(MusicController));
MusicRouter.post('/', MusicController.asyncCreateMusic.bind(MusicController));
MusicRouter.put('/:musicId/play_music', MusicController.asyncPlayMusic.bind(MusicController));
MusicRouter.put('/:musicId/change_image', MusicController.asyncChangeImage.bind(MusicController));
MusicRouter.put('/:musicId/change_music', MusicController.asyncChangeMusic.bind(MusicController));
MusicRouter.put('/:musicId', MusicController.asyncUpdateInfoMusic.bind(MusicController));
MusicRouter.delete('/:musicId', MusicController.asyncDeleteMusic.bind(MusicController));

module.exports = MusicRouter;