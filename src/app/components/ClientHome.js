"use client";


import dynamic from 'next/dynamic';
import '../styles/markdown.css';
import { useState, useEffect } from 'react';
import TruncatedContent from './TruncatedContent';
import SkillBubble from './SkillBubble';
import rehypeRaw from 'rehype-raw';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
const rehypeHighlight = dynamic(() => import('rehype-highlight'), { ssr: false });

const YouTubeEmbed = ({ url }) => {
  const videoId = url.split('v=')[1];
  return (
    <div className="aspect-w-16 aspect-h-9 my-4">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
};

const CustomLink = ({ href, children }) => {
  if (href.includes('youtube.com') || href.includes('youtu.be')) {
    return <YouTubeEmbed url={href} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
};

function Section({ title, items, renderItem }) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-6">
        {items.map(renderItem)}
      </div>
    </section>
  );
}

const Card = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div 
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition duration-300 shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
};


export default function ClientHome({ initialData }) {
  console.log('Initial data received in ClientHome:', initialData);

  const [websites, setWebsites] = useState(initialData.websites);
  const [musicWorks, setMusicWorks] = useState(initialData.musicWorks);
  const [contributions, setContributions] = useState(initialData.contributions);
  const [skills, setSkills] = useState(initialData.skills);
  const [education, setEducation] = useState(initialData.education);

  console.log('State in ClientHome:', { websites, musicWorks, contributions, skills, education });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black-900 to-violet-900 text-gray-100">
      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-white">Andrew Rapier</h1>
          <p className="text-xl text-gray-300 mb-4">Full-Stack Developer | Producer | Technology Enthusiast</p>
          <h2 className="text-2xl font-semibold mb-4 text-white">Skills & Expertise</h2>
          <p className="text-gray-300 italic font-light text-sm animate-pulse mb-4">
            Explore my expertise – hover and click any skill for details
          </p>
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {skills.map((skill) => (
                <SkillBubble key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section
            title="Websites"
            items={websites}
            renderItem={(website) => (
              <Card key={website.id}>
                <h3 className="text-2xl font-semibold mb-2 text-white">{website.title}</h3>
                <TruncatedContent content={website.content} maxLength={150} />
                {website.url && (
                  <a 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Visit Website →
                  </a>
                )}
              </Card>
            )}
          />

          <Section
            title="Publications & Resources"
            items={contributions}
            renderItem={(contribution) => (
              <Card key={contribution.id}>
                <h3 className="text-2xl font-semibold mb-2 text-white">{contribution.title}</h3>
                <TruncatedContent content={contribution.content} maxLength={150} />
                {contribution.url && (
                  <a 
                    href={contribution.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                  >
                    View Contribution →
                  </a>
                )}
              </Card>
            )}
          />
        </div>
        
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



      </main>

      <footer className="w-full text-center py-8 bg-black/20">
        <p className="text-gray-400">&copy; 2024 Andrew Rapier. All rights reserved.</p>
      </footer>
    </div>
  );
}