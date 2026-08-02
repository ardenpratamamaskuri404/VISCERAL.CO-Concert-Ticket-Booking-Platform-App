import fs from 'fs/promises';
import path from 'path';
import { Hono } from 'hono';
import { prisma } from '../config/db';
import { authMiddleware } from '../middlewares/auth.middleware';

const artistsRoutes = new Hono();

// GET all artists
artistsRoutes.get('/', async (c) => {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { name: 'asc' }
    });
    return c.json({ data: artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// POST create new artist (Admin only)
artistsRoutes.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }

    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const bio = body['bio'] as string;
    const photoFile = body['photoFile'] as File;

    if (!name) {
      return c.json({ error: 'Name is required' }, 400);
    }

    let photoUrl = null;
    if (photoFile) {
      const ext = path.extname(photoFile.name) || '.jpg';
      const filename = `art-${Date.now()}${ext}`;
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filepath = path.join(process.cwd(), 'public', 'assets', 'artists', filename);
      await fs.writeFile(filepath, buffer);
      photoUrl = filename;
    }

    const newArtist = await prisma.artist.create({
      data: {
        id: `art-${Date.now()}`,
        name,
        bio: bio || null,
        photoUrl: photoUrl,
      }
    });

    return c.json({ success: true, message: 'Artis berhasil ditambahkan', data: newArtist }, 201);
  } catch (error) {
    console.error('Error creating artist:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
// PUT update artist (Admin only)
artistsRoutes.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }

    const artistId = c.req.param('id');
    const existingArtist = await prisma.artist.findUnique({ where: { id: artistId } });
    if (!existingArtist) {
      return c.json({ error: 'Artist not found' }, 404);
    }

    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const bio = body['bio'] as string;
    const photoFile = body['photoFile'] as File;

    let photoUrl = existingArtist.photoUrl;

    if (photoFile) {
      const ext = path.extname(photoFile.name) || '.jpg';
      const filename = `art-${Date.now()}${ext}`;
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filepath = path.join(process.cwd(), 'public', 'assets', 'artists', filename);
      await fs.writeFile(filepath, buffer);
      
      // Try deleting old file
      if (existingArtist.photoUrl) {
        try {
          await fs.unlink(path.join(process.cwd(), 'public', 'assets', 'artists', existingArtist.photoUrl));
        } catch (e) {}
      }
      
      photoUrl = filename;
    }

    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: {
        name: name || existingArtist.name,
        bio: bio !== undefined ? bio : existingArtist.bio,
        photoUrl: photoUrl
      }
    });

    return c.json({ success: true, message: 'Artis berhasil diupdate', data: updatedArtist }, 200);
  } catch (error) {
    console.error('Error updating artist:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// DELETE artist (Admin only)
artistsRoutes.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }

    const artistId = c.req.param('id');
    const existingArtist = await prisma.artist.findUnique({ where: { id: artistId } });
    if (!existingArtist) {
      return c.json({ error: 'Artist not found' }, 404);
    }

    // Try deleting photo file if exists
    if (existingArtist.photoUrl) {
      try {
        await fs.unlink(path.join(process.cwd(), 'public', 'assets', 'artists', existingArtist.photoUrl));
      } catch (e) {
        console.warn('Failed to delete photo file:', e);
      }
    }

    await prisma.artist.delete({ where: { id: artistId } });

    return c.json({ success: true, message: 'Artis berhasil dihapus' }, 200);
  } catch (error) {
    console.error('Error deleting artist:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default artistsRoutes;
