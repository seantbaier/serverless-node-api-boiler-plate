import Joi from "@hapi/joi";

import JoiMimeType from "./extensions/joi-mime-type";

const CustomJoi = Joi.extend(JoiMimeType);

const FileUploadData = CustomJoi.object({
  name: CustomJoi.string().required(),
  type: CustomJoi.string().mimeType().required(),
  size: CustomJoi.number(),
  data: CustomJoi.string().dataUri().required(),
});

export default FileUploadData;
