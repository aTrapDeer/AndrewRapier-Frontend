"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import './styles/markdown.css';
import { useState } from 'react';
import TruncatedContent from './components/TruncatedContent';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
const rehypeHighlight = dynamic(() => import('rehype-highlight'), { ssr: false });

// This function fetches data from your API
async function fetchData(endpoint) {
  const res = await fetch(`http://localhost:5000/api/${endpoint}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

function Section({ title, items, renderItem }) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-white">{title}</h2>
      <div className="space-y-6">
        {items.map(renderItem)}
      </div>
    </section>
  );
}

export default function Home() {
  const [websites, setWebsites] = useState([]);
  const [musicWorks, setMusicWorks] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);

  useState(() => {
    async function fetchAllData() {
      const websitesData = await fetchData('websites');
      const musicWorksData = await fetchData('music');
      const contributionsData = await fetchData('contributions');
      const skillsData = await fetchData('skills');
      const educationData = await fetchData('education');

      setWebsites(websitesData);
      setMusicWorks(musicWorksData);
      setContributions(contributionsData);
      setSkills(skillsData);
      setEducation(educationData);
    }

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-white">Andrew Rapier</h1>
          <p className="text-xl text-gray-300 mb-4">Full-Stack Developer | Producer | Technology Enthusiast</p>
          <h2 className="text-2xl font-semibold mb-4 text-white">Skills & Expertise</h2>
          <p className="text-gray-300 italic font-light text-sm animate-pulse">
            Explore my expertise – click any skill for details
          </p>
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition duration-300">
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section
            title="Websites"
            items={websites}
            renderItem={(website) => (
              <div key={website.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition duration-300">
                <h3 className="text-2xl font-semibold mb-2 text-white">{website.title}</h3>
                <TruncatedContent content={website.content} />
                {website.url && (
                  <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400 mt-4 inline-block transition duration-300">
                    Visit Website →
                  </a>
                )}
              </div>
            )}
          />

          <Section
            title="Contributions"
            items={contributions}
            renderItem={(contribution) => (
              <div key={contribution.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition duration-300">
                <h3 className="text-2xl font-semibold mb-2 text-white">{contribution.title}</h3>
                <TruncatedContent content={contribution.content} />
                {contribution.url && (
                  <a href={contribution.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400 mt-4 inline-block transition duration-300">
                    View Contribution →
                  </a>
                )}
              </div>
            )}
          />
        </div>

        <Section
          title="Music Work"
          items={musicWorks}
          renderItem={(work) => (
            <div key={work.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition duration-300">
              <h3 className="text-2xl font-semibold mb-2 text-white">{work.title}</h3>
              <TruncatedContent content={work.content} />
              {work.url && (
                <a href={work.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400 mt-4 inline-block transition duration-300">
                  Listen/Watch →
                </a>
              )}
            </div>
          )}
        />

        <Section
          title="Education"
          items={education}
          renderItem={(edu) => (
            <div key={edu.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition duration-300">
              <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
              <p className="text-lg text-gray-300">{edu.institution}</p>
              <p className="text-md text-gray-400">{edu.start_date} - {edu.end_date}</p>
              <TruncatedContent content={edu.description} />
            </div>
          )}
        />
      </main>

      <footer className="w-full text-center py-8 bg-black/20">
        <p className="text-gray-400">&copy; 2023 Andrew Rapier. All rights reserved.</p>
      </footer>
    </div>
  );
}