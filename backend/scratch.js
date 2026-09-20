const urls = [
'https://martinjuez.com/',
'https://eco-finance-app-b9km.onrender.com/',
'https://eventorjfc.onrender.com/',
'https://eventos-liard-pi.vercel.app/',
'https://blog-de-arte.vercel.app/',
'https://proyecto-final-sigma-two.vercel.app/',
'https://juguetopolis.pages.dev/',
'https://biblioteca-mqbk.onrender.com/',
'https://nbmotionshots-links.pages.dev/',
'https://nbmotionshots.pages.dev/',
'https://www.gjlasesores.com/',
'https://www.gjuarezlopez.com.mx/index.html',
'https://www.contrerassteel.com/'
];

async function main() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      // Try to match og:image or twitter:image
      let ogImage = '';
      
      const ogMatch1 = text.match(/<meta[^>]*property=['"]og:image['"][^>]*content=['"]([^'"]+)['"]/i);
      const ogMatch2 = text.match(/<meta[^>]*content=['"]([^'"]+)['"][^>]*property=['"]og:image['"]/i);
      const twitterMatch1 = text.match(/<meta[^>]*name=['"]twitter:image['"][^>]*content=['"]([^'"]+)['"]/i);
      const twitterMatch2 = text.match(/<meta[^>]*content=['"]([^'"]+)['"][^>]*name=['"]twitter:image['"]/i);

      if (ogMatch1) ogImage = ogMatch1[1];
      else if (ogMatch2) ogImage = ogMatch2[1];
      else if (twitterMatch1) ogImage = twitterMatch1[1];
      else if (twitterMatch2) ogImage = twitterMatch2[1];

      // fallback to any image if no meta tag
      if (!ogImage) {
          const imgMatch = text.match(/<img[^>]*src=['"]([^'"]+)['"]/i);
          if (imgMatch) ogImage = imgMatch[1];
      }

      console.log(url + ' => ' + (ogImage ? ogImage : 'Sin imagen'));
    } catch (e) {
      console.log(url + ' => Error: ' + e.message);
    }
  }
}
main();
