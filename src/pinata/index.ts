import { PinataSDK } from 'pinata';
import { File } from '@web-std/file';
import sharp from 'sharp';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export async function uploadToPinata(image: {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}): Promise<string> {
  try {
    const resizedImage: Buffer = await sharp(image.buffer)
      .resize(1000, 1000, {
        fit: 'cover',
      })
      .toBuffer();

    const file = new File([resizedImage], image.originalname, { type: image.mimetype });
    const upload = await pinata.upload.public.file(file);

    return await pinata.gateways.public.convert(upload.cid);
  } catch (error) {
    console.error('Pinata upload failed:', error);
    throw new Error('Pinata upload failed');
  }
}
