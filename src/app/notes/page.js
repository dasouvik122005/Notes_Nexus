import React from 'react';
import NeoCard from '@/components/NeoCard';

const subjects = [
  { title: 'Engineering Mathematics-1', link: 'https://drive.google.com/drive/folders/19Qp9sGX4yeSTF9mr0WkV5gc_DAPjXnuC?usp=sharing' },
  { title: 'Basic Electronics', link: 'https://drive.google.com/drive/folders/1D2OU-9zE-nkKvH7YRc3seo3byAWWuj3W?usp=sharing' },
  { title: 'Environmental Studies', link: 'https://drive.google.com/drive/folders/1vkFhoYksnMAaQPe0cIaPY-C0rDTtuDBK?usp=sharing' },
  { title: 'Professional Communication', link: 'https://www.google.com' },
  { title: 'C programming', link: 'https://drive.google.com/drive/folders/14cpebF5l2sjGi_51_JuYwn0RNa5JdEZ4?usp=sharing' },
  { title: 'Engineering Physics', link: 'https://drive.google.com/drive/folders/1PjKnhqgwlWDVfcUkWrhVo59UQlllqhXE?usp=sharing' },
  { title: 'Engineering Chemistry', link: 'https://drive.google.com/drive/folders/1WcYLATUrBVMOr_CAYZmJQCETWgcLKAiO?usp=sharing' },
  { title: 'HTML', link: 'https://drive.google.com/drive/folders/11LerP-u-VO534jLXe7UWhBawhEpINK22?usp=sharing' },
  { title: 'CSS', link: 'https://drive.google.com/drive/folders/1x5cgIVbjC8NMStu0xnq-v-Moe0RSbyaB?usp=sharing' },
  { title: 'Java Script', link: 'https://drive.google.com/drive/folders/1Enu4uzASVj2d5jXALZIoAWWtqvVAQFnt?usp=sharing' },
  { title: 'Machine Learning', link: 'https://drive.google.com/drive/folders/1IT4w7Ijl5i6bLYh53RM2xonh47JqPUvE?usp=drive_link' },
  { title: 'Computer Networks', link: 'https://drive.google.com/drive/folders/1og3uY1n3jUXPMCKUGwoEaXz4kZDWHJ0B?usp=sharing' },
  { title: 'Aptitude', link: 'https://drive.google.com/drive/folders/1AoOILHs9vFyuMsVuOOHNLR43oAmiTvAi?usp=sharing' },
  { title: 'AI', link: 'https://drive.google.com/drive/folders/1v-M963QwhI8GZaOKXhORRMHUFHp56aS-?usp=sharing' },
  { title: 'Data Structure', link: 'https://drive.google.com/drive/folders/1-v40NeVyTZizHmuw-d71Fkn65e8Rruen?usp=sharing' },
  { title: 'Basic Electrical Engineering', link: 'https://drive.google.com/drive/folders/1pALo1iYmINytMzFkzjJHU7yyCpjtHpaM?usp=sharing' }
];

export default function NotesPage() {
  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        <h1 className="animate-fade-in-up" style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          marginBottom: '3rem',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '-1px'
        }}>
          Browse <span style={{
            backgroundColor: 'var(--primary-pink)',
            padding: '0 0.5rem',
            border: '4px solid var(--black)',
            display: 'inline-block',
            transform: 'rotate(-2deg)'
          }}>Notes</span>
        </h1>
        
        <div className="animate-fade-in-up delay-200" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {subjects.map((subject, index) => (
            <NeoCard 
              key={index}
              title={subject.title}
              actionLink={subject.link}
              imageSrc="/subject.png"
            >
              Access the complete study materials for {subject.title} from JIS University CSE department.
            </NeoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
