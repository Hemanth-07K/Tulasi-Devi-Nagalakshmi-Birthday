const SITE_CONFIG = Object.freeze({
  birthday: Object.freeze({
    birthIso: '2003-09-29T00:00:00',
    monthIndex: 8,
    day: 29,
    year: 2003,
    celebrationYear: 2026
  }),
  firstMeeting: Object.freeze({ day: 4, month: 1, year: 2025 }),
  displayName: 'Potti',
  birthdayGreetingName: 'Tulasi',
  letterSignoff: 'Hemanth ❤️'
});

const BIRTHDAY_CONTENT = {
  2026: {
    age: 23,
    wishes: [
      'I hope you find work that makes you proud, challenges you in the right ways, and gives you reasons to smile at the end of the day.',
      'I hope life gives you countless little reasons to smile, even on the days when you aren\'t looking for one.',
      "I hope you travel to places you've never imagined, collect beautiful memories, and come home with stories you'll never stop telling.",
      'I hope you are surrounded by people who understand your silence, celebrate your happiness, and stay through the difficult days.',
      'I hope every year teaches you something new, makes you stronger, and brings you a little closer to the life you imagine.',
      'I hope you always have something to look forward to, someone to laugh with, and a reason to believe that the best days are still ahead.'
    ],
    finalWish: 'May this new year of your life bring you courage for every dream, strength for every challenge, success in everything you pursue, and countless reasons to smile.'
  },
  2027: {
    age: 24,
    wishes: ['A fresh year deserves fresh reasons to smile.','Keep choosing the life that feels honest to you.'],
    finalWish: 'May your 24th year be full of growth, laughter, courage and beautiful surprises.'
  },
  2028: {
    age: 25,
    wishes: ['A new chapter. A new year. More life to discover.','May the quiet dreams become real little by little.'],
    finalWish: 'May 25 bring you closer to every dream that matters to you.'
  }
};

const MEMORIES = [
  {src:'assets/memories/memory-01.jpg', date:'12 Jun 2026', text:'One ordinary moment that became a memory.'},
  {src:'assets/memories/memory-02.jpg', date:'13 Jun 2026', text:'Some days stay with us for reasons we never planned.'},
  {src:'assets/memories/memory-03.jpg', date:'13 Jun 2026', text:'A little frame from a much bigger story.'},
  {src:'assets/memories/memory-04.jpg', date:'13 Jun 2026', text:'The kind of moment worth keeping close.'},
  {src:'assets/memories/memory-05.jpg', date:'17 Mar 2026', text:'And somehow, it all became part of the journey.'}
];
const REAL_MEMORIES = [
  {src:'assets/real-memories/real-memory-01.jpg', date:'25 Dec 2025', text:"Some people don't need the spotlight. Somehow, it finds them anyway."},
  {src:'assets/real-memories/real-memory-02.jpg', date:'13 Jun 2026', text:"A simple moment. A familiar smile. Somehow, the little moments become the ones worth remembering."},
  {src:'assets/real-memories/real-memory-03.jpg', date:'29 Sep 2026', text:"Princess Birthday celebration in office."},
  {src:'assets/real-memories/real-memory-04.jpg', date:'13 Jun 2026', text:"Somewhere between the mirror and that smile, you made the whole moment worth remembering."},
  {src:'assets/real-memories/real-memory-05.jpg', date:'25 Mar 2026', text:"Those eyes don't always say much. Somehow, they still say enough."},
  {src:'assets/real-memories/real-memory-06.jpg', date:'12 Jun 2026', text:"Some moments aren't planned. They just become part of the story."},
  {src:'assets/real-memories/real-memory-07.jpg', date:'13 Jun 2026', text:"You look beautiful in crowded places, but somehow, you belong to quiet moments too."},
  {src:'assets/real-memories/real-memory-08.jpg', date:'31 Oct 2024', text:"Some pictures capture a moment. Some quietly capture an entire version of you."},
  {src:'assets/real-memories/real-memory-09.jpg', date:'08 Jan 2026', text:"And then there is you, simply being yourself - beautiful even on an ordinary day."},
  {src:'assets/real-memories/real-memory-10.jpg', date:'02 Mar 2024', text:"There is something about your smile that makes an ordinary moment feel a little softer."}
];
const PRIVATE_MEMORIES = [
  {src:'assets/private-memories/private-01.jpg', date:'', text:'For a moment, it felt like the world had quietly made room for just us.'},
  {src:'assets/private-memories/private-02.jpg', date:'13 Jun 2026', text:'A little piece of Paris… brought to you.'},
  {src:'assets/private-memories/private-03.png', date:'15 Mar 2026', text:'Somehow, even ordinary moments became memories with you.'},
  {src:'assets/private-memories/private-04.jpg', date:'17 Mar 2026', text:'No faces. No words. Just us.'},
  {src:'assets/private-memories/private-05.jpg', date:'17 Mar 2026', text:'The kind of closeness that made everything else disappear.'},
  {src:'assets/private-memories/private-06.jpg', date:'17 Mar 2026', text:'Somewhere between the smiles and the silence, there was us.'},
  {src:'assets/private-memories/private-07.jpg', date:'12 Jun 2026', text:'Just another ordinary day that somehow became one of my favourite memories.'},
  {src:'assets/private-memories/private-08.png', date:'13 Jun 2026', text:'You walked ahead… and I just wanted to keep following.'},
  {src:'assets/private-memories/private-09.jpg', date:'14 Jun 2026', text:'Maybe this is what home felt like for a while.'},
  {src:'assets/private-memories/private-10.jpg', date:'12 Jun 2026', text:'And then there were moments when holding on said everything.'},
  {src:'assets/private-memories/private-11.jpg', date:'27 Sep 2026', text:'The moment that we never forget.'}
];
const VIDEOS = ['assets/videos/memory-video-01.mp4','assets/videos/memory-video-02.mp4','assets/videos/memory-video-03.mp4','assets/videos/memory-video-04.mp4'];
const TIMELINE = [
  {date:'JUNE 2021', title:'The First Connection', text:'Two paths quietly crossed on Instagram, without knowing where they would lead.'},
  {date:'SOMEWHERE ALONG THE WAY', title:'Senior & Junior', text:'You became Junior. I became Senior. Somehow, that little bond stayed.'},
  {date:'LATE 2024', title:'Finding Our Way Back', text:"Graduation was ending, conversations returned, and slowly, we became part of each other's days again."},
  {date:'04 JAN 2025', title:'The First Meeting', text:'The person behind the screen became real - laughter, food, little moments, and a day to remember.'},
  {date:'27 OCT 2025', title:'Meeting Again', text:'After a while, we met again, shared a meal, and let an old connection find its way back.'},
  {date:'JANUARY 2026', title:'A Different Question', text:"I asked for a future together. You weren't ready to say yes, and some things needed time."},
  {date:'15 MAR 2026', title:'The Turning Point', text:'One day in Hyderabad changed something between us. You saw my patience, my care, and the way I stood beside you - and that evening, you finally told me how you felt.'},
  {date:'17 MAR 2026', title:'The Beginning of Us', text:'Two days later, we met again. Movies, laughter, photographs and countless little moments - and somewhere in that day, our “us” truly began.'},
  {date:'AFTER 17 MAR 2026', title:'Learning Each Other', text:'We were learning how to love each other - not perfectly, but honestly.'},
  {date:'ALONG THE WAY', title:'The Little Things', text:'Between the serious conversations were silly moments, unexpected laughter and memories that belonged only to us.'},
  {date:'12–13 JUN 2026', title:'Two Days Together', text:'Food, streets, rain, Shilparamam, photographs and endless conversations - two days that gave us so many little memories.'},
  {date:'13 JUN 2026', title:'A Little Promise', text:'Among all those moments, you asked me to place a chain around your neck - a little promise carrying a much bigger meaning.'},
  {date:'11 JUL 2026', title:'A Birthday From Afar', text:"You couldn't be beside me, so you found a hundred little ways to make me feel remembered."},
  {date:'A LITTLE WHILE LATER', title:'Care Can Look Different', text:'Sometimes my care felt like control to you. I only knew I was trying to protect someone who had become precious to me.'},
  {date:'ALONG THE WAY', title:'The Little Fights', text:'There were arguments, stubborn silences and moments of “leave me alone.” Yet somehow, neither of us stayed away for long.'},
  {date:'ALONG THE WAY', title:'Finding Our Way Back', text:'Somehow, after every difficult moment, we found another reason to talk, laugh, care and stay.'},
  {date:'26 SEP 2026', title:'A Birthday Before Its Day', text:'You opened the gift I had prepared for you - the little things I had chosen with you in mind. That night, we shared memories, laughter, and conversations that brought us a little closer.'},
  {date:'27 Sep 2026', title:'A Night Across Hyderabad', text:'From late-night roads to Niloufer, Charminar, Tank Bund, and back again - we wandered, talked, ate, laughed, and made another day that felt completely ours.'},
  {date:'29 Sep 2026', title:'The Day You Were Born', text:'At midnight, I wished you first - and watched my little surprise make you smile. You wore the dress I gave you, celebrated your day, and somewhere between it all, you told me you missed me.'},
  {date:'AND THEN…', title:'Still Becoming Our Story', text:"We didn't have a perfect story. We had a real one - with laughter, fear, fights, care, forgiveness, and two people who kept finding their way back."}
];
const HER_WORLD = [
  'You give so much love without even realizing how much you give.',
  'You overthink everything… and somehow still make everything cute.',
  'You walked into my life and quietly changed its meaning.',
  "Those eyes don't just catch attention… they make it difficult to look away.",
  'Your quiet kindness makes you feel at ease around you.',
  "Once you set your heart on something, you don't give up easily."
];
const FUN_MOMENTS = [
  'I hope you find work that makes you proud.',
  'I hope you laugh so much that your stomach hurts.',
  "I hope you travel to places you've never imagined.",
  'I hope you have people around you who make ordinary days beautiful.',
  'I hope you never stop learning something new.',
  'May the year ahead bring you happiness, success, peace, good health, beautiful memories, and countless reasons to smile…'
];
const LETTER_LINES = [
  '**Dear Potti,**',
  'Some people come into our lives quietly, and somehow, without us realizing it, they become a beautiful part of our story.',
  "When I look back at everything we have shared, I don't think only about the big moments. I remember the little conversations, the laughter, the silly moments, the unexpected memories, the misunderstandings, the quiet days, and all those times we somehow found our way back to each other.",
  "We haven't always understood each other perfectly. We've had our differences, our fears, our arguments and our silences. But through all of it, there was always something that kept bringing us back to the same place - **us.**",
  "And maybe that's what makes what we have special.",
  "It isn't perfect.",
  "It doesn't have to be.",
  "It's ours.",
  "I'm grateful for every memory we've created, every smile you've given me, every moment you've trusted me, and even the difficult moments that taught us how to understand each other a little better.",
  "You became someone who is deeply woven into my everyday thoughts, my happiness, my plans, and the little things I look forward to.",
  "And I don't want this letter to sound like I'm looking back at something that is over.",
  "**I'm looking at everything we've been through and thinking about everything that's still waiting for us.**",
  "There are still so many places to go, meals to share, silly fights to laugh about later, pictures we haven't taken, dreams we haven't lived, and ordinary days that will someday become our favourite memories.",
  "So if there is one thing I want you to remember today, it's this:",
  "**I don't want to simply remember the beautiful moments we've already had.**",
  '**I want to keep creating them with you.**',
  "I want us to keep learning each other, choosing each other, laughing together, growing together, and finding our way back to each other - again and again.",
  '**Happy Birthday, Potti.**',
  "Here's to everything we've already lived,",
  "everything we're living now,",
  'and everything beautiful that is still waiting for **us.** ❤️',
  '**With love,**',
  '**Always yours.**'
];

function getBirthdayPack(year = new Date().getFullYear()) {
  if (BIRTHDAY_CONTENT[year]) return BIRTHDAY_CONTENT[year];
  const age = Math.max(0, year - SITE_CONFIG.birthday.year);
  return {
    age,
    wishes: [
      'May this year bring you more reasons to laugh, grow and feel proud of the life you are building.',
      'May the dreams you carry quietly get room to become real.',
      'May ordinary days keep turning into memories worth keeping.',
      'And may “five minutes” become five minutes at least once. 😂'
    ],
    finalWish: `May your ${age}th year bring you courage, peace, success, laughter and beautiful surprises.`
  };
}

const PRIVATE_CODE_POOL = Object.freeze([
  { label: 'the day we first met', value: '04' },
  { label: "of your Kanna's birthday date", value: '11' },
  { label: "the last two digits of your Kanna's phone number", value: '66' },
  { label: "of your Kanna's birthday month", value: '07' },
  { label: 'the month we first met', value: '01' },
  { label: "the first two digits of your Kanna's mobile number", value: '93' }
]);

function shufflePrivatePool() {
  const pool = PRIVATE_CODE_POOL.map(item => ({...item}));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function createPrivateCodeSession() {
  const shuffled = shufflePrivatePool();
  const selected = shuffled.slice(0, 2);
  return {
    selected,
    code: selected.map(item => item.value).join('')
  };
}
