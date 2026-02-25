import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dv251twzd", // replace with your cloud name
  },
});

const ProductImage = ({ publicId }) => {
  if (!publicId) return null;

  const img = cld
    .image(publicId)
    .resize(fill().width(300).height(300));

  return <AdvancedImage cldImg={img} />;
};

export default ProductImage;