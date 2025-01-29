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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TechnoIconComponent, PaperProofComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  aiTechnologies: Technology[] = [
    {
      src: 'assets/images/technos/mistral.webp',
      alt: 'Mistral AI',
      name: 'Mistral AI❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/chat-gpt.webp',
      alt: 'ChatGPT',
      name: 'ChatGPT❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
    },
    {
      src: 'assets/images/technos/claude.webp',
      alt: 'Claude',
      name: 'Claude',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/gemini.webp',
      alt: 'Gemini',
      name: 'Gemini',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/half.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/midjourney.webp',
      alt: 'Midjourney',
      name: 'Midjourney❤️',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/yellow.webp',
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
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/ts.webp',
      alt: 'TypeScript',
      name: 'TypeScript',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
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
    {
      src: 'assets/images/technos/c-sharp.png',
      alt: 'C#',
      name: 'C#',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
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
      star4: 'assets/images/stars/half.webp',
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
      star3: 'assets/images/stars/yellow.webp',
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
      star5: 'assets/images/stars/half.webp',
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
      src: 'assets/images/technos/vs-code.webp',
      alt: 'VS Code',
      name: 'VS Code',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/half.webp',
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
      src: 'assets/images/technos/unity.png',
      alt: 'Unity',
      name: 'Unity',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/half.webp',
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
  ];

  databases: Technology[] = [
    {
      src: 'assets/images/technos/couchdb.webp',
      alt: 'CouchDB',
      name: 'CouchDB',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/yellow.webp',
      star5: 'assets/images/stars/clear.webp',
    },
    {
      src: 'assets/images/technos/mongodb.webp',
      alt: 'MongoDB',
      name: 'MongoDB',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
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
  ];

  automationTools: Technology[] = [
    {
      src: 'assets/images/technos/n8n.webp',
      alt: 'N8n',
      name: 'N8n',
      star1: 'assets/images/stars/yellow.webp',
      star2: 'assets/images/stars/yellow.webp',
      star3: 'assets/images/stars/yellow.webp',
      star4: 'assets/images/stars/clear.webp',
      star5: 'assets/images/stars/clear.webp',
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
      alt: 'Prremiere Pro',
      name: 'Prremiere Pro',
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
      alt: 'Certfiied Junior Angular Developer',
    },
    {
      date: '2025-01-29',
      src: 'assets/images/certifications/certified-chatbot-expert.png',
      alt: 'Certfiied Chatbot Expert',
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

  copyDiscordUsername(): void {
    navigator.clipboard.writeText('kitsuiwebster').then(() => {
      const copiedMessage = document.createElement('div');
      copiedMessage.id = 'copiedMessage';
      copiedMessage.innerText = 'Copied to clipboard!';

      copiedMessage.style.position = 'fixed';
      copiedMessage.style.top = '40px';
      copiedMessage.style.left = '50%';
      copiedMessage.style.transform = 'translateX(-50%)';
      copiedMessage.style.color = 'red';
      copiedMessage.style.padding = '10px 20px';
      copiedMessage.style.borderRadius = '4px';
      copiedMessage.style.zIndex = '9999';

      document.body.appendChild(copiedMessage);
      setTimeout(() => {
        document.body.removeChild(copiedMessage);
      }, 3000);
    });
  }
}
