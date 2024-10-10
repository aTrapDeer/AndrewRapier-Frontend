import { fetchData } from './utils/api';
import ClientHome from './components/ClientHome';

export const revalidate = 3600; 

async function getData() {
  const websites = await fetchData('websites', { next: { revalidate: 3600 } });
  const musicWorks = await fetchData('music', { next: { revalidate: 3600 } });
  const contributions = await fetchData('contributions', { next: { revalidate: 3600 } });
  const skills = await fetchData('skills', { next: { revalidate: 3600 } });
  const education = await fetchData('education', { next: { revalidate: 3600 } });

  console.log('Fetched data:', { websites, musicWorks, contributions, skills, education });

  return {
    websites,
    musicWorks,
    contributions,
    skills,
    education,
  };
}

export default async function Home() {
  const data = await getData();
  console.log('Data passed to ClientHome:', data);
  return <ClientHome initialData={data} />;
}