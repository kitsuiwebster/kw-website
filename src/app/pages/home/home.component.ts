import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnoIconComponent } from '../../components/techno-icon/techno-icon.component';
import { PaperProofComponent } from '../../components/paperproof/paperproof.component';

interface Technology {
  src: string;
  alt: string;
  name: string;
  star1: string;
  star2: string;
  star3: string;
  star4: string;
  star5: string;
}

interface Certification {
  date: string;
  src: string;
  alt: string;
}

interface SkillSection {
  key: string;
  title: string;
  technologies: Technology[];
}

interface JourneyItem {
  period: string;
  title: string;
  company: string;
  type?: string;
  location: string;
  countryEmoji: string;
  highlights: string[];
  stack: string[];
  techLogos?: string[];
  logo: string;
  secondaryLogo?: string;
  horizontalLogo?: boolean;
  roundedLogo?: boolean;
}

interface TrainingItem {
  period: string;
  title: string;
  company: string;
  location: string;
  countryEmoji: string;
  topics: string[];
  techLogos?: string[];
  logo: string;
  secondaryLogo?: string;
  horizontalLogo?: boolean;
  roundedLogo?: boolean;
  highlights?: string[];
}

interface ConferenceItem {
  period: string;
  title: string;
  type: string;
  location: string;
  countryEmoji: string;
  talks: string[];
  logo: string;
  horizontalLogo?: boolean;
  roundedLogo?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TechnoIconComponent, PaperProofComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isDiscordCopied = false;
  private discordToastTimeoutId?: number;

  aiTechnologies: Technology[] = [
    {
      src: 'assets/images/technos/mistral.webp',
      alt: 'Mistral',
      name: 'Mistral❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/chat-gpt.webp',
      alt: 'ChatGPT',
      name: 'ChatGPT',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/claude.svg',
      alt: 'Claude',
      name: 'Claude',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/huggingface.png',
      alt: 'HuggingFace',
      name: 'HuggingFace',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/gemini.webp',
      alt: 'Gemini',
      name: 'Gemini',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/midjourney.png',
      alt: 'Midjourney',
      name: 'Midjourney',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/elevenlabs.png',
      alt: 'ElevenLabs',
      name: 'ElevenLabs',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
  ];

  languages: Technology[] = [
    {
      src: 'assets/images/technos/html.webp',
      alt: 'HTML',
      name: 'HTML',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/css.webp',
      alt: 'CSS',
      name: 'CSS❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/sass.webp',
      alt: 'Sass',
      name: 'Sass',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/js.webp',
      alt: 'JavaScript',
      name: 'JavaScript',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/ts.webp',
      alt: 'TypeScript',
      name: 'TypeScript',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/half.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/rust.png',
      alt: 'Rust',
      name: 'Rust',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/python.webp',
      alt: 'Python',
      name: 'Python',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
  ];

  devTechnologies: Technology[] = [
    {
      src: 'assets/images/technos/react.webp',
      alt: 'React.js',
      name: 'React.js',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/angular.png',
      alt: 'Angular',
      name: 'Angular❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/vuejs.png',
      alt: 'Vue.js',
      name: 'Vue.js',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/nuxt.png',
      alt: 'Nuxt.js',
      name: 'Nuxt.js',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/next.webp',
      alt: 'Next.js',
      name: 'Next.js',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/tailwind.png',
      alt: 'Tailwind CSS',
      name: 'Tailwind CSS',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/half.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/node.webp',
      alt: 'Node.js',
      name: 'Node.js',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/nest.webp',
      alt: 'NestJS',
      name: 'NestJS',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/electron.png',
      alt: 'Electron.js',
      name: 'Electron.js',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
  ];

  devTools: Technology[] = [
    {
      src: 'assets/images/technos/git.webp',
      alt: 'Git',
      name: 'Git',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/gitlab.png',
      alt: 'GitLab',
      name: 'GitLab',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/github.svg',
      alt: 'GitHub',
      name: 'GitHub',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/gitea.png',
      alt: 'Gitea',
      name: 'Gitea',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/vs-code.webp',
      alt: 'VS Code',
      name: 'VS Code',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/figma.webp',
      alt: 'Figma',
      name: 'Figma',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/insomnia.png',
      alt: 'Insomnia',
      name: 'Insomnia',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/half.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/nx.png',
      alt: 'Nx',
      name: 'Nx',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/365.png',
      alt: 'Microsoft 365',
      name: 'Microsoft 365',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/half.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/gas.png',
      alt: 'Google Apps Script',
      name: 'Google Apps Script',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
  ];

  databases: Technology[] = [
    {
      src: 'assets/images/technos/couchdb.webp',
      alt: 'CouchDB',
      name: 'CouchDB❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/mongodb.webp',
      alt: 'MongoDB',
      name: 'MongoDB',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/mysql.png',
      alt: 'MySQL',
      name: 'MySQL',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
  ];

  architectureTechnologies: Technology[] = [
    {
      src: 'assets/images/technos/docker.webp',
      alt: 'Docker',
      name: 'Docker❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/gcp.png',
      alt: 'GCP',
      name: 'GCP',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/kubernetes.png',
      alt: 'Kubernetes',
      name: 'Kubernetes',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/gravitee.png',
      alt: 'Gravitee',
      name: 'Gravitee',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/keycloak.png',
      alt: 'Keycloak',
      name: 'Keycloak',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/azure.png',
      alt: 'Azure',
      name: 'Azure',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
  ];

  automationTools: Technology[] = [
    {
      src: 'assets/images/technos/n8n.webp',
      alt: 'N8n',
      name: 'N8n❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/nodered.webp',
      alt: 'Node-RED',
      name: 'Node-RED',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/flowise.svg',
      alt: 'Flowise',
      name: 'Flowise',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
  ];

  systems: Technology[] = [
    {
      src: 'assets/images/technos/windows.webp',
      alt: 'Windows',
      name: 'Windows',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/linux.webp',
      alt: 'Linux',
      name: 'Linux❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/bash.webp',
      alt: 'Bash',
      name: 'Bash',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/zsh.webp',
      alt: 'Zsh',
      name: 'Zsh',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/conda.webp',
      alt: 'Conda',
      name: 'Conda',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/raspberry-pi.webp',
      alt: 'Raspberry Pi',
      name: 'Raspberry Pi',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/workstation.webp',
      alt: 'Workstation',
      name: 'Workstation',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/virtualbox.webp',
      alt: 'Virtualbox',
      name: 'Virtualbox',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
  ];

  visualTools: Technology[] = [
    {
      src: 'assets/images/technos/premiere-pro.png',
      alt: 'Premiere Pro',
      name: 'Premiere Pro',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/vegas-pro.webp',
      alt: 'Vegas Pro',
      name: 'Vegas Pro',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/kden-live.webp',
      alt: 'Kden Live',
      name: 'Kden Live',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/gimp.webp',
      alt: 'Gimp',
      name: 'Gimp',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
    {
      src: 'assets/images/technos/blender.webp',
      alt: 'Blender',
      name: 'Blender',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/obs.webp',
      alt: 'OBS',
      name: 'OBS',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
  ];

  musicTools: Technology[] = [
    {
      src: 'assets/images/technos/fl-studio.webp',
      alt: 'FL Studio',
      name: 'FL Studio❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/reaper.webp',
      alt: 'Reaper',
      name: 'Reaper❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/cubase.webp',
      alt: 'Cubase',
      name: 'Cubase',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/logicpro.png',
      alt: 'Logic Pro',
      name: 'Logic Pro',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/auto-tune.webp',
      alt: 'Auto-tune',
      name: 'Auto-tune',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
    },
  ];

  professionalTitles: Certification[] = [
    {
      date: '2022-11-21',
      src: 'assets/images/certifications/systems-and-networks-tech.png',
      alt: 'Systems and Networks Technician (Cybersecurity Option)',
    },
    {
      date: '2024-04-19',
      src: 'assets/images/certifications/web-integrator-and-developer.png',
      alt: 'Web Integrator and Developer',
    },
  ];

  certifs: Certification[] = [
    {
      date: '2023-08-30',
      src: 'assets/images/certifications/prompt-engineer.webp',
      alt: 'Certified Prompt Engineer',
    },
    {
      date: '2024-06-11',
      src: 'assets/images/certifications/react-developer.webp',
      alt: 'Certified React Developer',
    },
    {
      date: '2023-08-21',
      src: 'assets/images/certifications/csi-linux-investigator.webp',
      alt: 'Certified CSI Linux Investigator',
    },
    {
      date: '2024-06-26',
      src: 'assets/images/certifications/gravitee-certified.png',
      alt: 'Gravitee.io Certified',
    },
    {
      date: '2024-11-18',
      src: 'assets/images/certifications/certified-junior-angular-developer.png',
      alt: 'Certified Junior Angular Developer',
    },
    {
      date: '2025-01-29',
      src: 'assets/images/certifications/certified-chatbot-expert.png',
      alt: 'Certified Chatbot Expert',
    },
  ];

  certificates: Certification[] = [
    {
      date: '2023-07-02',
      src: 'assets/images/certifications/coc-linux.webp',
      alt: 'Certificate of Completion General Linux Administration',
    },
    {
      date: '2023-01-03',
      src: 'assets/images/certifications/just-javascript.webp',
      alt: 'Certificate of Completion Just JavaScript',
    },
  ];

  collapsedSections: { [key: string]: boolean } = {
    ai: true,
    languages: true,
    dev: true,
    devTools: true,
    databases: true,
    architecture: true,
    automation: true,
    system: true,
    visual: true,
    music: true,
  };

  skillSections: SkillSection[] = [
    { key: 'ai', title: 'AI - Prompt Engineering', technologies: this.aiTechnologies },
    { key: 'languages', title: 'Languages', technologies: this.languages },
    { key: 'dev', title: 'Development', technologies: this.devTechnologies },
    { key: 'devTools', title: 'Development Tools', technologies: this.devTools },
    { key: 'databases', title: 'Databases', technologies: this.databases },
    { key: 'architecture', title: 'Architecture', technologies: this.architectureTechnologies },
    { key: 'automation', title: 'Automation', technologies: this.automationTools },
    { key: 'system', title: 'System', technologies: this.systems },
    { key: 'visual', title: 'Visual', technologies: this.visualTools },
    { key: 'music', title: 'Music', technologies: this.musicTools },
  ];

  journey: JourneyItem[] = [
    {
      period: 'Feb 2023 - Present',
      title: 'Prompt Engineer / DevSecOps Engineer',
      company: 'Bashroom',
      type: 'Hybrid',
      location: 'Balma',
      countryEmoji: '🇫🇷',
      highlights: [
        'Specializing in Prompt Engineering across GPT-4, Claude 3, Mistral, Llama 2, Gemini and image generative models like Midjourney and Stable Diffusion.',
        'Implementing scripting solutions with Bash, TypeScript, JavaScript, and Python.',
        'Creating complex N8N architectures and workflows, as well as Flowise flows.',
        'Participating in events such as FOSDEM, RivieraDev, DevFest and BCON with the team.',
        'Developing Discord bots, notably CozyBot, with the ambition to put them into production.',
        'Working as a trainer in the field of Prompt Engineering.',
        'Creating chatbots using various LLMs to test their limits and attempting to hack system prompts.',
      ],
      stack: ['Prompt Engineering', 'Data Engineering'],
      techLogos: [
        'assets/images/technos/chat-gpt.webp',
        'assets/images/technos/mistral.webp',
        'assets/images/technos/claude.svg',
        'assets/images/technos/gemini.webp',
        'assets/images/technos/js.webp',
        'assets/images/technos/ts.webp',
        'assets/images/technos/python.webp',
        'assets/images/technos/bash.webp',
        'assets/images/technos/docker.webp',
        'assets/images/technos/kubernetes.png',
        'assets/images/technos/n8n.webp',
        'assets/images/technos/flowise.svg',
        'assets/images/technos/vs-code.webp',
        'assets/images/technos/midjourney.png',
        'assets/images/technos/gcp.png',
        'assets/images/technos/git.webp',
        'assets/images/technos/gitlab.png',
        'assets/images/technos/gitea.png',
        'assets/images/technos/zsh.webp',
        'assets/images/technos/linux.webp',
        'assets/images/technos/obs.webp',
        'assets/images/technos/gas.png',
        'assets/images/technos/html.webp',
        'assets/images/technos/css.webp',
        'assets/images/technos/azure.png',
        'assets/images/technos/insomnia.png',
        'assets/images/technos/node.webp',
        'assets/images/technos/365.png'
      ],
      logo: 'assets/images/logos/logo-bashroom.png',
      horizontalLogo: true,
    },
    {
      period: 'Jun 2025 - Feb 2026',
      title: 'AI Systems Architect',
      company: 'D-CISIF via Bashroom',
      location: 'Toulouse',
      countryEmoji: '🇫🇷',
      highlights: [
        'Created complex N8N architectures and workflows.',
        'Implemented agentic AI systems with Mistral AI.',
      ],
      stack: ['Prompt Engineering', 'Data Engineering', 'Agentic Systems'],
      techLogos: [
        'assets/images/technos/mistral.webp',
        'assets/images/technos/n8n.webp',
        'assets/images/technos/js.webp',
        'assets/images/technos/elevenlabs.png',
        'assets/images/technos/azure.png',
        'assets/images/technos/365.png'
      ],
      logo: 'assets/images/logos/dcisif.png',
      secondaryLogo: 'assets/images/logos/logo-bashroom.png',
      roundedLogo: true,
    },
    {
      period: 'Sep 2024 - Nov 2024',
      title: 'Full Stack Developer',
      company: 'Gamma Solutions via Bashroom',
      type: 'Freelance',
      location: 'Paris',
      countryEmoji: '🇫🇷',
      highlights: [
        'Participated in the integration of a web application using Angular.',
        'Developed backend services with NestJS.',
        'Worked with Nx monorepo architecture.',
        'Implemented responsive UI with TypeScript and CSS.',
      ],
      stack: ['Monorepo Architecture'],
      techLogos: [
        'assets/images/technos/angular.png',
        'assets/images/technos/nest.webp',
        'assets/images/technos/ts.webp',
        'assets/images/technos/css.webp',
        'assets/images/technos/nx.png',
        'assets/images/technos/git.webp',
        'assets/images/technos/gitlab.png',
        'assets/images/technos/vs-code.webp',
        'assets/images/technos/tailwind.png',
        'assets/images/technos/html.webp',
        'assets/images/technos/node.webp'
      ],
      logo: 'assets/images/logos/gamma-solutions.png',
      secondaryLogo: 'assets/images/logos/logo-bashroom.png',
      horizontalLogo: true,
      roundedLogo: true,
    },
    {
      period: 'May 2024 - Sep 2024',
      title: 'DevOps Engineer',
      company: 'Hachette Livre via Bashroom',
      type: 'Freelance · Hybrid',
      location: 'Balma',
      countryEmoji: '🇫🇷',
      highlights: [
        'Developed a frontend using Nuxt.js.',
        'Configured Gravitee (API Management) for advanced API management.',
        'Participated in the configuration of Keycloak, notably enhancing access security.',
        'Contributed to the development of Rust scripts for the Axum backend.',
        'Structured an Insomnia collection, facilitating the testing and validation of APIs.',
      ],
      stack: [],
      techLogos: [
        'assets/images/technos/nuxt.png',
        'assets/images/technos/js.webp',
        'assets/images/technos/rust.png',
        'assets/images/technos/gravitee.png',
        'assets/images/technos/keycloak.png',
        'assets/images/technos/insomnia.png',
        'assets/images/technos/css.webp',
        'assets/images/technos/git.webp',
        'assets/images/technos/vs-code.webp',
        'assets/images/technos/gitlab.png',
        'assets/images/technos/kubernetes.png',
        'assets/images/technos/docker.webp',
        'assets/images/technos/node.webp',
        'assets/images/technos/html.webp',
        'assets/images/technos/electron.png'
      ],
      logo: 'assets/images/logos/hachette.png',
      secondaryLogo: 'assets/images/logos/logo-bashroom.png',
      horizontalLogo: true,
    },
    {
      period: 'Jan 2024 - Present',
      title: 'Artist, Producer',
      company: 'VCG Recordz',
      type: 'Self-employed · Hybrid',
      location: 'Valleiry',
      countryEmoji: '🇫🇷',
      highlights: [
        'Working as a team with music producers to record, mix, produce, and realize musical projects.',
      ],
      stack: ['Communication', 'Audio Mixing', 'Digital Marketing', 'Music Production'],
      techLogos: [
        'assets/images/technos/fl-studio.webp',
        'assets/images/technos/reaper.webp',
        'assets/images/technos/auto-tune.webp'
      ],
      logo: 'assets/images/logos/vcg.png',
    },
    {
      period: 'May 2023',
      title: 'HackAPrompt 2023',
      company: 'HackAPrompt',
      type: 'International Challenge',
      location: 'Online',
      countryEmoji: '🌍',
      highlights: [
        'Participated in the HackAPrompt 2023 challenge and finished 11th out of 2,680 participants.',
        'Wrote an article about my experience through this challenge.',
      ],
      stack: ['Prompt Engineering', 'Prompt Hacking'],
      techLogos: [
        'assets/images/technos/chat-gpt.webp',
        'assets/images/technos/huggingface.png'
      ],
      logo: 'assets/images/logos/aicrowd.png',
    },
    {
      period: 'Feb 2023 - Feb 2024',
      title: 'Web Integrator',
      company: 'OpenClassrooms',
      type: 'Training',
      location: 'Online',
      countryEmoji: '🌍',
      highlights: [
        'Completed intensive web development training program.',
        'Mastered modern web integration techniques and best practices.',
        'Built multiple real-world projects using HTML, CSS, JavaScript and responsive design.',
      ],
      stack: ['Responsive Design', 'Accessibility', 'SEO'],
      techLogos: [
        'assets/images/technos/html.webp',
        'assets/images/technos/css.webp',
        'assets/images/technos/js.webp',
        'assets/images/technos/git.webp',
        'assets/images/technos/github.svg',
        'assets/images/technos/node.webp',
        'assets/images/technos/insomnia.png',
        'assets/images/technos/figma.webp'
      ],
      logo: 'assets/images/logos/openclassrooms.png',
    },
    {
      period: 'Jan 2023 - Feb 2023',
      title: 'Internship',
      company: 'Bashroom',
      location: 'Balma',
      countryEmoji: '🇫🇷',
      highlights: [
        'Participated in a seminar with the Bashroom team where I strengthened my knowledge of JavaScript.',
        'Became a member of the team and participated in group projects.',
      ],
      stack: [],
      techLogos: [
        'assets/images/technos/js.webp',
        'assets/images/technos/node.webp',
        'assets/images/technos/zsh.webp',
        'assets/images/technos/linux.webp',
        'assets/images/technos/git.webp'
      ],
      logo: 'assets/images/logos/logo-bashroom.png',
      horizontalLogo: true,
    },
    {
      period: 'Nov 2022 - Dec 2022',
      title: 'Internship',
      company: 'Bashroom',
      location: 'Balma',
      countryEmoji: '🇫🇷',
      highlights: [
        'Data acquisition and creation of a Discord bot.',
        'Developed scripts with Google Apps Script.',
        'Learned how to code scripts with Google Apps Script.',
        'Optimized mental model of JavaScript and became familiar with Angular framework.',
        'Learned the basics of HTML.',
      ],
      stack: [],
      techLogos: [
        'assets/images/technos/js.webp',
        'assets/images/technos/ts.webp',
        'assets/images/technos/node.webp',
        'assets/images/technos/angular.png',
        'assets/images/technos/html.webp',
        'assets/images/technos/css.webp',
        'assets/images/technos/bash.webp',
        'assets/images/technos/linux.webp',
        'assets/images/technos/zsh.webp',
        'assets/images/technos/git.webp',
        'assets/images/technos/gas.png'
      ],
      logo: 'assets/images/logos/logo-bashroom.png',
      horizontalLogo: true,
    },
    {
      period: 'Sep 2022 - Oct 2022',
      title: 'Internship',
      company: 'Bashroom',
      location: 'Balma',
      countryEmoji: '🇫🇷',
      highlights: [
        'Discovered the Rust language as a stepping stone to development.',
        'Learned the basics of the Angular framework.',
        'Carried out various technical tasks combining software and hardware: installed Ubuntu Server 22.04 on a Raspberry PI, configured Linux via SSH, installed raspi-config to enable serial port, connected Raspberry PI to UART, created UDEV rule, installed Minicom and accessed Raspberry PI via serial port.',
      ],
      stack: ['Ubuntu', 'UART'],
      techLogos: [
        'assets/images/technos/rust.png',
        'assets/images/technos/angular.png',
        'assets/images/technos/ts.webp',
        'assets/images/technos/bash.webp',
        'assets/images/technos/linux.webp',
        'assets/images/technos/raspberry-pi.webp',
        'assets/images/technos/html.webp',
        'assets/images/technos/git.webp',
        'assets/images/technos/gitlab.png'
      ],
      logo: 'assets/images/logos/logo-bashroom.png',
      horizontalLogo: true,
    },
    {
      period: 'Jan 2022 - Nov 2022',
      title: 'Systems & Networks Technician (Cybersecurity Option)',
      company: 'OnlineFormaPro',
      type: 'Training',
      location: 'Le Bourget-du-Lac',
      countryEmoji: '🇫🇷',
      highlights: [
        'Set up Windows and Linux servers (LAMP).',
        'Set up a LAN with routers and Cisco switches.',
        'Configured an Active Directory domain.',
        'GDPR awareness and customer relations.',
        'Ticket management with GLPI.',
        'Set up clusters with Hyper-V and vSphere.',
        'Simulated LANs with GNS3, Packet Tracer and VMware Workstation.',
        'Installed user workstations.',
        'Learned network models and various technical protocols.',
        'Learned IT/business English.',
      ],
      stack: ['Network Protocols', 'GDPR'],
      techLogos: [
        'assets/images/technos/bash.webp',
        'assets/images/technos/linux.webp',
        'assets/images/technos/windows.webp',
        'assets/images/technos/workstation.webp',
        'assets/images/technos/gns3.png',
        'assets/images/technos/packet-tracer.webp',
        'assets/images/technos/azure.png'
      ],
      logo: 'assets/images/logos/ofp.svg',
      horizontalLogo: true,
    },
    {
      period: 'Sep 2021 - Jan 2022',
      title: 'IT Services for Organizations (Infrastructure, System and Network Solutions Option)',
      company: 'Ecoris',
      type: 'Training',
      location: 'Chambéry',
      countryEmoji: '🇫🇷',
      highlights: [
        'Designed complex network diagrams and infrastructure schemas.',
        'Developed web interfaces using HTML and CSS.',
        'Studied legal frameworks and IT-specific English.',
        'Implemented advanced networking configurations and protocols.',
        'Learned scripting and algorithmic concepts with Python.',
      ],
      stack: ['Network Infrastructure', 'System Administration', 'Web Development'],
      techLogos: [
        'assets/images/technos/packet-tracer.webp',
        'assets/images/technos/workstation.webp',
        'assets/images/technos/windows.webp',
        'assets/images/technos/python.webp',
        'assets/images/technos/conda.webp',
        'assets/images/technos/html.webp',
        'assets/images/technos/css.webp'
      ],
      logo: 'assets/images/logos/ecoris.png',
      horizontalLogo: true,
    },
    {
      period: 'Jun 2021',
      title: 'Internship',
      company: 'F@mi Services',
      type: 'Networks Technician',
      location: 'Chambéry',
      countryEmoji: '🇫🇷',
      highlights: [
        'Accompanied the company manager in all interventions for a month.',
        'Replacements or installations of switches and routers.',
        'Set up user stations for new small businesses.',
        'Installed alarm systems for individuals.',
        'Stock management.',
        'Computer disassembly.',
      ],
      stack: ['Stock Management', 'Hardware Installation'],
      techLogos: [
        'assets/images/technos/windows.webp'
      ],
      logo: 'assets/images/logos/fami-services.png',
    },
    {
      period: 'Dec 2020',
      title: 'Internship',
      company: 'Citron & Co',
      type: 'Graphic Design',
      location: 'Chambéry',
      countryEmoji: '🇫🇷',
      highlights: [
        'Discovered the Adobe suite, including InDesign, Photoshop, Illustrator, and Premiere Pro.',
        'Collaborated with a freelance graphic designer.',
      ],
      stack: [],
      techLogos: [
        'assets/images/technos/premiere-pro.png',
        'assets/images/technos/illustrator.png',
        'assets/images/technos/photoshop.png'
      ],
      logo: 'assets/images/logos/citronco.png',
      horizontalLogo: true,
    },
    {
      period: 'Feb 2015',
      title: 'Internship',
      company: 'Studio Prism',
      type: 'Sound Engineering',
      location: 'Lausanne',
      countryEmoji: '🇨🇭',
      highlights: [
        'Completed internship at a recording studio with sound engineer Philippe Mercier.',
        'Sound recording, audio editing, mixing, and debriefing with artists.',
      ],
      stack: ['Sound Recording', 'Audio Editing', 'Audio Mixing'],
      techLogos: [
        'assets/images/technos/cubase.webp'
      ],
      logo: 'assets/images/logos/studio-prism.png',
      horizontalLogo: true,
      roundedLogo: true,
    },
  ];

  trainings: TrainingItem[] = [
    {
      period: 'Apr 2025',
      title: 'Prompt Engineering & AI Training',
      company: 'Virtual Expo via Kampus Training',
      location: 'Marseille',
      countryEmoji: '🇫🇷',
      topics: ['Prompt Engineering', 'Conversational AI', 'Productivity'],
      highlights: [
        'Teaching fundamentals of interaction with AI tools and language models.',
        'Structuring effective prompts for precise and relevant results.',
        'Adapting AI interactions for different professional contexts.',
        'Identifying AI limitations and biases.',
        'Optimizing collaboration between humans and AI through practical workshops.',
      ],
      techLogos: ['assets/images/technos/chat-gpt.webp'],
      logo: 'assets/images/logos/virtual-expo.png',
      secondaryLogo: 'assets/images/logos/kampus.png',
      horizontalLogo: true,
    },
    {
      period: 'Mar 2025',
      title: 'Generative AI Training',
      company: 'Marfret via Kampus Training',
      location: 'Marseille',
      countryEmoji: '🇫🇷',
      topics: ['Generative AI', 'Office 365 AI Integration', 'AI & Legal'],
      highlights: [
        'Understanding fundamental AI concepts, opportunities and limitations.',
        'Identifying relevant AI use cases for IT roles and business processes.',
        'Evaluating AI added value in strategic and operational decisions.',
        'Discovering accessible tools to apply AI in non-technical contexts.',
        'Hands-on practice with practical modules and real-world scenarios.',
        'Implementing agentic systems and Flowise workflows.',
      ],
      techLogos: [
        'assets/images/technos/chat-gpt.webp',
        'assets/images/technos/mistral.webp',
        'assets/images/technos/copilot.png',
        'assets/images/technos/flowise.svg'
      ],
      logo: 'assets/images/logos/marfret.svg',
      secondaryLogo: 'assets/images/logos/kampus.png',
      horizontalLogo: true,
    },
    {
      period: 'Jan 2025',
      title: 'Boostez votre créativité avec les IA génératives',
      company: 'Supermarché Match via Kampus Training',
      location: 'Lille',
      countryEmoji: '🇫🇷',
      topics: ['Visual Generative AI', 'Prompt Engineering', 'AI & Legal'],
      highlights: [
        'Understanding key concepts behind generative AI technologies.',
        'Mastering Midjourney and DALL-E to generate engaging visuals.',
        'Learning to create impactful prompts for image generation.',
        'Integrating AI tools into creative workflows for efficiency.',
        'Mastering legal and ethical best practices for AI-generated content.',
      ],
      techLogos: [
        'assets/images/technos/chat-gpt.webp',
        'assets/images/technos/gemini.webp',
        'assets/images/technos/midjourney.png'
      ],
      logo: 'assets/images/logos/supermarcher-match.png',
      secondaryLogo: 'assets/images/logos/kampus.png',
      horizontalLogo: true,
    },
    {
      period: 'Nov 2024',
      title: 'IA Légal, Sécurité et Éthique',
      company: 'EPF via Kampus Training',
      location: 'Nice',
      countryEmoji: '🇫🇷',
      topics: ['AI Security', 'AI Ethics', 'AI & Legal'],
      highlights: [
        'Understanding GDPR compliance and personal data protection in AI systems.',
        'Mastering AI Act regulations, risk classification, and obligations for high-risk AI.',
        'Exploring intellectual property issues and authorship rights for AI-generated content.',
        'Identifying AI security threats and implementing best practices across the AI lifecycle.',
        'Applying ethical principles for trustworthy AI: transparency, fairness, human control, and accountability.',
      ],
      logo: 'assets/images/logos/epf.jpg',
      secondaryLogo: 'assets/images/logos/kampus.png',
      horizontalLogo: true,
      roundedLogo: true,
    },
  ];

  conferences: ConferenceItem[] = [
    {
      period: 'Jul 2025',
      title: 'RivieraDev 2025',
      type: 'Attendee/Sponsor',
      location: 'Sophia Antipolis',
      countryEmoji: '🇫🇷',
      talks: [
        'My selection of talks:',
        'Gateway API 10 ans de maturation pour une nouvelle API Kubernetes - Kevin Davin',
        'Comment j\'ai porté Doom sur navigateur grâce au WebAssembly - Yassine Benabbas',
        'Spotify: an insider view - Rachel Dubois',
      ],
      logo: 'assets/images/logos/rivieradev.jpg',
      horizontalLogo: true,
      roundedLogo: true,
    },
    {
      period: 'Apr 2025',
      title: 'La Cycom 2025',
      type: 'Attendee',
      location: 'Montpellier',
      countryEmoji: '🇫🇷',
      talks: [
        'Attended all talks throughout the entire event.',
      ],
      logo: 'assets/images/logos/cycom.png',
      horizontalLogo: true,
      roundedLogo: true,
    },
    {
      period: 'Nov 2024',
      title: 'DevFest Toulouse 2024',
      type: 'Attendee',
      location: 'Toulouse',
      countryEmoji: '🇫🇷',
      talks: [
        'My selection of talks:',
        'Les lois universelles de la performance - Raphaël Luta',
        'Art & Entropie: Du chaos dans ton frontend - Thibaud Courtoison',
        'Intégration à l\'ère du cloud avec Camel Quarkus - Zineb Bendhiba',
      ],
      logo: 'assets/images/logos/devfest-toulouse.png',
      horizontalLogo: true,
    },
    {
      period: 'Jul 2024',
      title: 'RivieraDev 2024',
      type: 'Attendee/Sponsor',
      location: 'Sophia Antipolis',
      countryEmoji: '🇫🇷',
      talks: [
        'My selection of talks:',
        'Live coding musical: vous savez coder? Devenez compositeur avec WebAudio et WebMIDI - Sylvain Wallez',
        'La checklist ultime pour rendre vos applications cloud natives - Katia Himeur',
        'Un Dev, un Ops et Git - Seront ils autorisés à casser la prod - James Searby & Fabrice Pipart',
      ],
      logo: 'assets/images/logos/rivieradev.jpg',
      horizontalLogo: true,
      roundedLogo: true,
    },
    {
      period: 'Nov 2023',
      title: 'Blender Conference 2023',
      type: 'Attendee',
      location: 'Amsterdam',
      countryEmoji: '🇳🇱',
      talks: [
        'My selection of talks:',
        'Test, Build, Release: Streamlining Add-On Development with Automation – Andy Gajdosik',
        'Getting Started with Scripting in Python – Mike Shah',
        'USD driven pipelines – Tobias Guenther',
      ],
      logo: 'assets/images/logos/bcon.jpg',
      horizontalLogo: true,
      roundedLogo: true,
    },
    {
      period: 'Nov 2023',
      title: 'DevFest Toulouse 2023',
      type: 'Attendee',
      location: 'Toulouse',
      countryEmoji: '🇫🇷',
      talks: [
        'My selection of talks:',
        'Les lois universelles de la performance - Raphaël Luta',
        'Art & Entropie: Du chaos dans ton frontend - Thibaud Courtoison',
        'Intégration à l\'ère du cloud avec Camel Quarkus - Zineb Bendhiba',
      ],
      logo: 'assets/images/logos/devfest-toulouse.png',
      horizontalLogo: true,
    },
    {
      period: 'Jan 2023',
      title: 'FOSDEM 2023',
      type: 'Attendee',
      location: 'Brussels',
      countryEmoji: '🇧🇪',
      talks: [
        'My selection of talks:',
        'Les lois universelles de la performance - Raphaël Luta',
        'Art & Entropie: Du chaos dans ton frontend - Thibaud Courtoison',
        'Intégration à l\'ère du cloud avec Camel Quarkus - Zineb Bendhiba',
      ],
      logo: 'assets/images/logos/fosdem.svg',
      horizontalLogo: true,
    },
  ];

  toggleSection(key: string): void {
    this.collapsedSections[key] = !this.collapsedSections[key];
  }

  copyDiscordUsername(): void {
    navigator.clipboard.writeText('kitsuiwebster').then(() => {
      this.isDiscordCopied = true;
      if (this.discordToastTimeoutId) {
        window.clearTimeout(this.discordToastTimeoutId);
      }
      this.discordToastTimeoutId = window.setTimeout(() => {
        this.isDiscordCopied = false;
      }, 2200);
    });
  }

  getTechNameFromPath(path: string): string {
    const filename = path.split('/').pop()?.split('.')[0] || '';
    const nameMap: { [key: string]: string } = {
      'chat-gpt': 'ChatGPT',
      'vs-code': 'VS Code',
      'node': 'Node.js',
      'packet-tracer': 'Packet Tracer',
      'fl-studio': 'FL Studio',
      'premier-pro': 'Premiere Pro',
      'vegas-pro': 'Vegas Pro',
      'kden-live': 'Kden Live',
      'auto-tune': 'Auto-tune',
      'gns3': 'GNS3',
      'nx': 'Nx',
      'gas': 'Google Apps Script',
      'copilot': 'Microsoft Copilot'
    };
    return nameMap[filename] || filename.charAt(0).toUpperCase() + filename.slice(1);
  }
}
