import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import pinataSDK from '@pinata/sdk';

// Initialize Pinata SDK
// Ensure PINATA_JWT is set in your .env.local file
const pinataJwt = process.env.PINATA_JWT;
if (!pinataJwt) {
  console.error('Pinata JWT not found in environment variables.');
  // Optionally throw an error during build or startup if preferred
}
const pinata = pinataJwt ? new pinataSDK({ pinataJWTKey: pinataJwt }) : null;

// Helper function to convert FormData file to Readable stream
async function fileToReadableStream(file: File): Promise<Readable> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Signal end of stream
  return stream;
}

export async function POST(request: Request) {
  if (!pinata) {
    return NextResponse.json({ error: 'Pinata service not configured.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Convert file to readable stream for Pinata SDK
    const stream = await fileToReadableStream(file);

    // Pinata options (optional)
    const options = {
      pinataMetadata: {
        name: file.name,
        // Add any other metadata you need, e.g., keyvalues: { userId: 'user123' }
      },
      pinataOptions: {
        cidVersion: 0 as 0 | 1 | undefined, // Use CID v0 for shorter hashes often used in URLs
      },
    };

    // Upload stream to Pinata
    const result = await pinata.pinFileToIPFS(stream, options);

    // Return the IPFS hash (CID)
    return NextResponse.json({ ipfsHash: result.IpfsHash }, { status: 200 });
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    // Check if error is a Pinata specific error type if available
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload.';
    return NextResponse.json(
      { error: 'Failed to upload file to IPFS.', details: errorMessage },
      { status: 500 }
    );
  }
}
