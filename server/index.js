import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new Database(join(__dirname, '..', 'skillshift.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    skills TEXT NOT NULL,
    hours TEXT,
    minAge INTEGER DEFAULT 18,
    salary TEXT NOT NULL,
    description TEXT,
    contactEmail TEXT,
    contactPhone TEXT,
    image TEXT,
    createdAt TEXT NOT NULL
  )
`);

// Seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
if (count.count === 0) {
  const seedJobs = [
    {
      id: randomUUID(),
      title: 'Content Creator Intern',
      company: 'Creative Space ID',
      location: 'Jakarta',
      type: 'Hybrid',
      category: 'Kreatif',
      skills: 'TikTok,Canva',
      hours: 'Fleksibel',
      minAge: 18,
      salary: 'Rp 2.000.000',
      description: 'Membangun branding visual perusahaan melalui konten media sosial harian.',
      contactEmail: 'hr@creative.id',
      contactPhone: '6281234567890',
      image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800',
      createdAt: '2026-05-20',
    },
    {
      id: randomUUID(),
      title: 'Barista Part-Time',
      company: 'Kopi Senja',
      location: 'Bandung',
      type: 'Onsite',
      category: 'F&B',
      skills: 'Komunikasi,Service',
      hours: 'Shift Sore',
      minAge: 19,
      salary: 'Rp 1.500.000',
      description: 'Melayani pelanggan dengan standar pelayanan tinggi di lingkungan yang tenang.',
      contactEmail: 'hr@kopisenja.com',
      contactPhone: '6289876543210',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800',
      createdAt: '2026-05-22',
    },
    {
      id: randomUUID(),
      title: 'UI/UX Designer',
      company: 'TechNova',
      location: 'Yogyakarta',
      type: 'Remote',
      category: 'IT',
      skills: 'Figma,Design',
      hours: '20 Jam/Minggu',
      minAge: 19,
      salary: 'Rp 2.500.000',
      description: 'Merancang antarmuka aplikasi yang intuitif bagi pengguna.',
      contactEmail: 'tech@nova.com',
      contactPhone: '6285522334455',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800',
      createdAt: '2026-05-23',
    },
  ];

  const insert = db.prepare(`
    INSERT INTO jobs (id, title, company, location, type, category, skills, hours, minAge, salary, description, contactEmail, contactPhone, image, createdAt)
    VALUES (@id, @title, @company, @location, @type, @category, @skills, @hours, @minAge, @salary, @description, @contactEmail, @contactPhone, @image, @createdAt)
  `);

  for (const job of seedJobs) {
    insert.run(job);
  }
  console.log('✓ Seed data inserted');
}

// API Routes

// Get all jobs
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = db.prepare('SELECT * FROM jobs ORDER BY createdAt DESC').all();
    // Parse skills from string to array
    const parsed = jobs.map(job => ({
      ...job,
      skills: job.skills.split(',').map(s => s.trim())
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single job
app.get('/api/jobs/:id', (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.skills = job.skills.split(',').map(s => s.trim());
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create job
app.post('/api/jobs', (req, res) => {
  try {
    const {
      title, company, location, type, category, skills,
      hours, minAge, salary, description, contactEmail, contactPhone, image
    } = req.body;

    const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;
    const id = randomUUID();
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO jobs (id, title, company, location, type, category, skills, hours, minAge, salary, description, contactEmail, contactPhone, image, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, company, location, type, category, skillsStr, hours || '', minAge || 18, salary, description || '', contactEmail || '', contactPhone || '', image || '', createdAt);

    const newJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    newJob.skills = newJob.skills.split(',').map(s => s.trim());

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
app.put('/api/jobs/:id', (req, res) => {
  try {
    const {
      title, company, location, type, category, skills,
      hours, minAge, salary, description, contactEmail, contactPhone, image
    } = req.body;

    const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;

    db.prepare(`
      UPDATE jobs SET
        title = ?, company = ?, location = ?, type = ?, category = ?,
        skills = ?, hours = ?, minAge = ?, salary = ?, description = ?,
        contactEmail = ?, contactPhone = ?, image = ?
      WHERE id = ?
    `).run(title, company, location, type, category, skillsStr, hours || '', minAge || 18, salary, description || '', contactEmail || '', contactPhone || '', image || '', req.params.id);

    const updatedJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
    updatedJob.skills = updatedJob.skills.split(',').map(s => s.trim());

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
app.delete('/api/jobs/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 SkillShift API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: skillshift.db\n`);
});
