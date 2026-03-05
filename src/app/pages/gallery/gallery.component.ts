import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
}

const KEYWORDS = 'Raphael Martin kitsuiwebster kitsui webster VCG valleiry';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [CommonModule],
})
export class GalleryComponent {
  images: GalleryImage[] = [
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-conference-ai-workflow-presentation.webp',
      alt: `${KEYWORDS} - presenting AI workflow automation at tech conference`,
      title: 'Raphael Martin - AI Conference Presentation',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsuiwebster-portrait-palm-trees-sunset.webp',
      alt: `${KEYWORDS} - portrait with palm trees at sunset`,
      title: 'Raphael Martin - Portrait Palm Trees Sunset',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsuiwebster-formal-portrait-suit.webp',
      alt: `${KEYWORDS} - formal portrait in suit professional photo`,
      title: 'Raphael Martin - Formal Professional Portrait',
    },
    {
      src: 'assets/images/gallery/kitsui-webster-raphael-martin-jersey-back-view.webp',
      alt: `${KEYWORDS} - jersey back view with Kitsui name printed`,
      title: 'Kitsui Webster - Jersey Back View',
    },
    {
      src: 'assets/images/gallery/raphael-martin-valleiry-portrait-suit-garden.webp',
      alt: `${KEYWORDS} - portrait in suit garden outdoor photoshoot`,
      title: 'Raphael Martin - Garden Portrait',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-portrait-toulouse-glass-buildings.webp',
      alt: `${KEYWORDS} - portrait in front of glass buildings Toulouse France`,
      title: 'Raphael Martin - Toulouse Urban Portrait',
    },
    {
      src: 'assets/images/gallery/raphael-martin-valleiry-portrait-toulouse-urban-style.webp',
      alt: `${KEYWORDS} - urban style portrait Toulouse glass architecture`,
      title: 'Raphael Martin - Toulouse Style Portrait',
    },
    {
      src: 'assets/images/gallery/raphael-martin-vcg-concert-stage-microphone-performance.webp',
      alt: `${KEYWORDS} - live concert stage performance with microphone`,
      title: 'Raphael Martin VCG - Live Concert Performance',
    },
    {
      src: 'assets/images/gallery/raphael-martin-vcg-lamborghini-urus-lyon-street.webp',
      alt: `${KEYWORDS} - with yellow Lamborghini Urus on Lyon street`,
      title: 'Raphael Martin VCG - Lamborghini Urus Lyon',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-vcg-lamborghini-duo-sunlight.webp',
      alt: `${KEYWORDS} - duo leaning on Lamborghini in city sunlight`,
      title: 'Raphael Martin VCG - Lamborghini Duo Sunlight',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-vcg-trio-lamborghini-lake-sunset.webp',
      alt: `${KEYWORDS} - trio with Lamborghini by the lake at sunset`,
      title: 'VCG Trio - Lamborghini Lake Sunset',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-torvad-festival-group-friends.webp',
      alt: `${KEYWORDS} - group photo at Torvad music festival`,
      title: 'Raphael Martin - Torvad Festival Group',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-webster-torvad-festival-trio.webp',
      alt: `${KEYWORDS} - trio friends at Torvad Festival event`,
      title: 'Kitsuiwebster - Torvad Festival Trio',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-football-club-portalban.webp',
      alt: `${KEYWORDS} - Football Club Portalban-Gletterens team photo`,
      title: 'Raphael Martin - Football Club Portalban',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsuiwebster-digital-art-mountain-landscape.webp',
      alt: `${KEYWORDS} - digital art illustration mountain landscape overlooking peaks`,
      title: 'Raphael Martin - Digital Art Mountain Landscape',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-coding-laptop-mercedes-garage.webp',
      alt: `${KEYWORDS} - developer coding on laptop next to Mercedes in garage`,
      title: 'Raphael Martin - Coding Next to Mercedes',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-developer-coding-laptop-vacation.webp',
      alt: `${KEYWORDS} - developer coding on laptop during vacation`,
      title: 'Raphael Martin - Developer Coding on Vacation',
    },
    {
      src: 'assets/images/gallery/raphael-martin-vcg-relaxing-couch-laptop-coding.webp',
      alt: `${KEYWORDS} - relaxing on couch with laptop coding session`,
      title: 'Raphael Martin - Couch Coding Session',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-gaming-setup-selfie.webp',
      alt: `${KEYWORDS} - selfie with multi-screen gaming and coding setup`,
      title: 'Kitsuiwebster - Gaming Setup Selfie',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-coding-night-session-valleiry.webp',
      alt: `${KEYWORDS} - night coding session developer laptop dark atmosphere`,
      title: 'Kitsuiwebster - Night Coding Session',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-webster-developer-coding-floor-office.webp',
      alt: `${KEYWORDS} - developer coding on floor in office relaxed style`,
      title: 'Kitsuiwebster - Developer Coding on Floor',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-coding-sofa-developer-lifestyle.webp',
      alt: `${KEYWORDS} - coding on sofa developer lifestyle laptop session`,
      title: 'Raphael Martin - Sofa Developer Lifestyle',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-developer-portrait-laptop.webp',
      alt: `${KEYWORDS} - developer portrait with laptop on sofa`,
      title: 'Raphael Martin - Developer Portrait',
    },
    {
      src: 'assets/images/gallery/raphael-martin-vcg-coding-session-focus-developer.webp',
      alt: `${KEYWORDS} - focused coding session developer at work`,
      title: 'Raphael Martin - Focused Coding Session',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-coding-anime-naruto-developer.webp',
      alt: `${KEYWORDS} - coding while watching anime Naruto on TV developer life`,
      title: 'Kitsuiwebster - Coding and Anime',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-webster-coding-upside-down-couch.webp',
      alt: `${KEYWORDS} - coding upside down on couch funny developer moment`,
      title: 'Raphael Martin - Upside Down Coding',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsuiwebster-car-ride-night.webp',
      alt: `${KEYWORDS} - night car ride with friend`,
      title: 'Raphael Martin - Night Car Ride',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-sunset-portrait-outdoor.webp',
      alt: `${KEYWORDS} - sunset portrait outdoor golden hour`,
      title: 'Raphael Martin - Sunset Golden Hour Portrait',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-coding-marina-sunset.webp',
      alt: `${KEYWORDS} - coding on laptop at marina during sunset`,
      title: 'Raphael Martin - Coding at Marina Sunset',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-coding-train-luggage-rack.webp',
      alt: `${KEYWORDS} - coding on train setting up laptop on luggage rack`,
      title: 'Raphael Martin - Coding on Train',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-coding-train-side-view.webp',
      alt: `${KEYWORDS} - coding on train side view developer traveling`,
      title: 'Raphael Martin - Train Coding Side View',
    },
    {
      src: 'assets/images/gallery/raphael-martin-vcg-coding-train-front-view.webp',
      alt: `${KEYWORDS} - coding on train front view with laptop`,
      title: 'Raphael Martin - Train Coding Front View',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-webster-coding-train-front-relaxed.webp',
      alt: `${KEYWORDS} - relaxed coding on train with feet up`,
      title: 'Kitsuiwebster - Relaxed Train Coding',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-coding-train-seat-night.webp',
      alt: `${KEYWORDS} - coding on train seat at night developer travel`,
      title: 'Raphael Martin - Night Train Coding',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-developer-train-terminal.webp',
      alt: `${KEYWORDS} - developer coding on train with terminal open`,
      title: 'Raphael Martin - Train Terminal Coding',
    },
    {
      src: 'assets/images/gallery/raphael-martin-valleiry-coding-train-photo-editing.webp',
      alt: `${KEYWORDS} - coding on train editing photos on laptop`,
      title: 'Raphael Martin - Photo Editing on Train',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-developer-dual-screen-setup-cozybot.webp',
      alt: `${KEYWORDS} - developer dual screen setup working on CozyBot project`,
      title: 'Raphael Martin - Dual Screen Developer Setup',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-coding-coworking-office.webp',
      alt: `${KEYWORDS} - coding at coworking office with laptop`,
      title: 'Raphael Martin - Coworking Office Coding',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-coding-coworking-relaxed.webp',
      alt: `${KEYWORDS} - relaxed coding at coworking space hooded`,
      title: 'Raphael Martin - Relaxed Coworking',
    },
    {
      src: 'assets/images/gallery/raphael-martin-vcg-coding-laptop-bed-night.webp',
      alt: `${KEYWORDS} - coding on laptop in bed at night developer lifestyle`,
      title: 'Raphael Martin - Night Coding in Bed',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-webster-coding-kitchen-ironing-board.webp',
      alt: `${KEYWORDS} - coding on laptop on ironing board in kitchen funny`,
      title: 'Kitsuiwebster - Coding on Ironing Board',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-coding-shower-laptop-funny.webp',
      alt: `${KEYWORDS} - coding with laptop in shower cabin funny developer moment`,
      title: 'Raphael Martin - Coding in the Shower',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsuiwebster-coding-train-station-lightning.webp',
      alt: `${KEYWORDS} - coding at train station during lightning storm`,
      title: 'Raphael Martin - Coding During Lightning Storm',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-coding-standing-train-station-storm.webp',
      alt: `${KEYWORDS} - standing and coding at train station during storm`,
      title: 'Raphael Martin - Standing Coding During Storm',
    },
    {
      src: 'assets/images/gallery/raphael-martin-kitsui-coding-playground-castres-park.webp',
      alt: `${KEYWORDS} - coding at playground in Castres park outdoor developer`,
      title: 'Raphael Martin - Coding at Playground Castres',
    },
    {
      src: 'assets/images/gallery/kitsuiwebster-raphael-martin-music-studio-production.webp',
      alt: `${KEYWORDS} - music studio production session with speakers and laptop`,
      title: 'Raphael Martin - Music Studio Production',
    },
  ];

  constructor(private meta: Meta, private titleService: Title) {
    this.titleService.setTitle('Gallery - Raphael Martin kitsuiwebster kitsui webster VCG valleiry');
    this.meta.updateTag({ name: 'description', content: 'Photo gallery of Raphael Martin (kitsuiwebster, kitsui, webster, VCG, valleiry) — Software Engineer, Prompt Engineer, Developer. Coding lifestyle, conferences, events, music, and portraits.' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: 'Gallery - Raphael Martin kitsuiwebster kitsui webster VCG valleiry' });
    this.meta.updateTag({ property: 'og:description', content: 'Photo gallery of Raphael Martin — kitsuiwebster, kitsui, webster, VCG, valleiry. Software Engineer & Prompt Engineer.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }
}
