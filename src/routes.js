const router = require('express').Router();
const multer = require('multer');
const Twit = require('./lib/twit');

const upload = multer();

router.post('/upload', upload.any(), async (req, res) => {
  const { tweet } = req.body;
  const file = req.files;

  const [buffer] = file.map((el) => el.buffer);

  if (buffer) {
    try {
      const uploadFile = await Twit().post('media/upload', {
        media_data: buffer.toString('base64'),
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
      console.error(error);
    }
  }
});

module.exports = router;
