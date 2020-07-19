const router = require('express').Router();
const multer = require('multer');
const Twit = require('./lib/twit');

const upload = multer();

router.post('/upload', upload.any(), async (req, res, next) => {
  const { tweet } = req.body;
  const file = req.files;

  const [base64file] = file.map((el) => el.buffer.toString('base64'));

  if (base64file) {
    try {
      const uploadFile = await Twit().post('media/upload', {
        media_data: base64file,
      });

      const media_id = uploadFile.data.media_id_string;

      if (media_id) {
        Twit().post('media/metadata/create', {
          media_id,
        });

        const params = {
          status: tweet,
          media_ids: [media_id],
        };

        const updateStatus = await Twit().post('statuses/update', params);

        return res.status(201).json(updateStatus);
      }
    } catch (error) {
      next(error);
    }
  }
});

module.exports = router;
