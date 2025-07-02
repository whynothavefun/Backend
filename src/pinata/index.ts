import { PinataSDK } from 'pinata';
import { File } from '@web-std/file';
import sharp from 'sharp';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export async function uploadCustomArtworkToPinata(
  image: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  },
  userWallet: string,
): Promise<string> {
  try {
    const postFix = image.originalname.split('.').at(1);
    const resizedImage: Buffer = await sharp(image.buffer)
      .resize(1000, 1000, {
        fit: 'cover',
      })
      .toBuffer();

    const file = new File([resizedImage], `${userWallet}.${postFix}`, { type: image.mimetype });
    const upload = await pinata.upload.public.file(file);

    return await pinata.gateways.public.convert(upload.cid);
  } catch (error) {
    console.error('Pinata upload failed:', error);
    throw new Error('Pinata upload failed');
  }
}

export async function uploadDefaultArtworkToPinata(svg: string, userWallet: string): Promise<string> {
  try {
    const buffer = Buffer.from(svg, 'utf-8');
    const file = new File([buffer], `${userWallet}.svg`, { type: 'image/svg+xml' });
    const upload = await pinata.upload.public.file(file);

    return await pinata.gateways.public.convert(upload.cid);
  } catch (error) {
    console.error('Pinata upload failed:', error);
    throw new Error('Pinata upload failed');
  }
}
