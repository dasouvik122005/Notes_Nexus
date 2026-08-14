"use client";
import React, { useState } from 'react';
import NeoCard from '@/components/NeoCard';
import AnimateInView from '@/components/AnimateInView';

import { 
  Calculator, Zap, Leaf, MessageCircle, Code, 
  Atom, FlaskConical, Globe, Palette, Braces, 
  Brain, Network, Lightbulb, Bot, Boxes, Plug,
  Terminal, Sigma, Library, Hash, Cpu, Server, GitBranch,
  BarChart, Monitor, GitCommit, Coffee, Briefcase,
  Database, FileCog, Shield, Shapes, TrendingUp,
  Wifi, Wrench, Smartphone, Cloud, Scale, Activity, GitMerge,
  Rocket, Laptop, Key, Radio, HardDrive, Eye, Layers, Gauge,
  Users, Clock, LineChart, Feather, CircuitBoard, Dna, Router, Target, Image as ImageIcon
} from 'lucide-react';

const subjects = [
  { title: 'Engineering Mathematics-1', icon: Calculator, link: 'https://drive.google.com/drive/folders/19Qp9sGX4yeSTF9mr0WkV5gc_DAPjXnuC?usp=sharing' },
  { title: 'Basic Electronics', icon: Zap, link: 'https://drive.google.com/drive/folders/1D2OU-9zE-nkKvH7YRc3seo3byAWWuj3W?usp=sharing' },
  { title: 'Environmental Studies', icon: Leaf, link: 'https://drive.google.com/drive/folders/1vkFhoYksnMAaQPe0cIaPY-C0rDTtuDBK?usp=sharing' },
  { title: 'Professional Communication', icon: MessageCircle, link: 'https://www.google.com' },
  { title: 'C programming', icon: Code, link: 'https://drive.google.com/drive/folders/14cpebF5l2sjGi_51_JuYwn0RNa5JdEZ4?usp=sharing' },
  { title: 'Engineering Physics', icon: Atom, link: 'https://drive.google.com/drive/folders/1PjKnhqgwlWDVfcUkWrhVo59UQlllqhXE?usp=sharing' },
  { title: 'Engineering Chemistry', icon: FlaskConical, link: 'https://drive.google.com/drive/folders/1WcYLATUrBVMOr_CAYZmJQCETWgcLKAiO?usp=sharing' },
  { title: 'HTML', icon: Globe, link: 'https://drive.google.com/drive/folders/11LerP-u-VO534jLXe7UWhBawhEpINK22?usp=sharing' },
  { title: 'CSS', icon: Palette, link: 'https://drive.google.com/drive/folders/1x5cgIVbjC8NMStu0xnq-v-Moe0RSbyaB?usp=sharing' },
  { title: 'Java Script', icon: Braces, link: 'https://drive.google.com/drive/folders/1Enu4uzASVj2d5jXALZIoAWWtqvVAQFnt?usp=sharing' },
  { title: 'Machine Learning', icon: Brain, link: 'https://drive.google.com/drive/folders/1IT4w7Ijl5i6bLYh53RM2xonh47JqPUvE?usp=drive_link' },
  { title: 'Computer Networks', icon: Network, link: 'https://drive.google.com/drive/folders/1og3uY1n3jUXPMCKUGwoEaXz4kZDWHJ0B?usp=sharing' },
  { title: 'Aptitude', icon: Lightbulb, link: 'https://drive.google.com/drive/folders/1AoOILHs9vFyuMsVuOOHNLR43oAmiTvAi?usp=sharing' },
  { title: 'AI', icon: Bot, link: 'https://drive.google.com/drive/folders/1v-M963QwhI8GZaOKXhORRMHUFHp56aS-?usp=sharing' },
  { title: 'Data Structure', icon: Boxes, link: 'https://drive.google.com/drive/folders/1-v40NeVyTZizHmuw-d71Fkn65e8Rruen?usp=sharing' },
  { title: 'Basic Electrical Engineering', icon: Plug, link: 'https://drive.google.com/drive/folders/1pALo1iYmINytMzFkzjJHU7yyCpjtHpaM?usp=sharing' },
  { title: 'Programming for Problem Solving', icon: Terminal, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Engineering Mathematics-II', icon: Sigma, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Indian Knowledge System', icon: Library, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Discrete Mathematics', icon: Hash, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Digital Logic and Electronics', icon: Cpu, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Computer Organization and Architecture', icon: Server, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Design and Analysis of Algorithms', icon: GitBranch, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Probability and Statistics', icon: BarChart, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Operating Systems', icon: Monitor, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Formal Language and Automata Theory', icon: GitCommit, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Object Oriented Programming using Java', icon: Coffee, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Principles of Management', icon: Briefcase, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Database Management Systems', icon: Database, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Compiler Design', icon: FileCog, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Cryptography and Network Security', icon: Shield, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Computer Graphics', icon: Shapes, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Economics for Engineers', icon: TrendingUp, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Web and Internet Technology', icon: Wifi, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Software Engineering', icon: Wrench, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Mobile Computing', icon: Smartphone, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Natural Language Processing', icon: MessageCircle, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Cloud Computing', icon: Cloud, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Cyber Law and Ethics', icon: Scale, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Neural Networks and Deep Learning', icon: Activity, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Advanced Algorithms', icon: GitMerge, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'High Performance Computing', icon: Rocket, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Advanced Operating Systems', icon: Laptop, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Information and Coding Theory', icon: Key, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Ad-Hoc and Sensor Networks', icon: Radio, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Data Mining and Data Warehouse', icon: HardDrive, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Computer Vision', icon: Eye, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Parallel Computing', icon: Layers, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Learning Optimization Techniques', icon: Gauge, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Human Resource Development and Organizational Behavior', icon: Users, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Real Time Systems', icon: Clock, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Data Analytics', icon: LineChart, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Soft Computing', icon: Feather, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'VLSI', icon: CircuitBoard, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Bioinformatics', icon: Dna, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Robotics', icon: Bot, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Introduction to IoT', icon: Router, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Image Processing', icon: ImageIcon, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' },
  { title: 'Optimization Techniques', icon: Target, link: 'https://drive.google.com/drive/folders/demo_link?usp=sharing' }
];

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(subject => 
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        <AnimateInView delay={0.1} direction="up">
          <h1 style={{
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
        </AnimateInView>

        <AnimateInView delay={0.15} direction="up" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <input 
            type="text" 
            placeholder="Search subjects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '1rem 1.5rem',
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              border: '4px solid var(--black)',
              boxShadow: '4px 4px 0px 0px var(--black)',
              outline: 'none',
              borderRadius: '0'
            }}
          />
        </AnimateInView>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
              <AnimateInView 
                key={subject.title} 
                delay={(index % 4) * 0.1} 
                direction="up" 
                style={{ height: '100%' }}
              >
                <NeoCard 
                  title={subject.title}
                  actionLink={subject.link}
                  icon={subject.icon}
                >
                  Access the complete study materials for {subject.title} from JIS University CSE department.
                </NeoCard>
              </AnimateInView>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', fontWeight: 800, fontSize: '1.5rem' }}>
              No subjects found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
