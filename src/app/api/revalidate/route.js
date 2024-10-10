import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const body = await request.json();
  const { secret } = body;
  console.log('Revalidating...');
  console.log('Secret...');
  // log the secret to double check it's correct
  console.log(process.env.REVALIDATION_SECRET);
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response(JSON.stringify({ message: 'Invalid secret' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      
    });
  }


  revalidatePath('/');

  return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}