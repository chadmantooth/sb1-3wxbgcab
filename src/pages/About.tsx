import React from 'react';

export function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About TechAnchorman</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48">
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQFg2Rg5Os-7cw/profile-displayphoto-shrink_400_400/B56ZQ_731fHQAg-/0/1736239448811?e=1741824000&v=beta&t=sb8H6Yx23g0S1SUbsGvYDjKDNEcx1z46QPpVana9O7g"
                alt="Chad Mantooth"
                className="w-full h-full rounded-lg object-cover shadow-md ring-4 ring-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/192x192/1a1f3d/ffffff?text=CM';
                  target.onerror = null; // Prevent infinite error loop
                }}
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-black/5"></div>
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chad Mantooth</h2>
            <div className="prose text-gray-600 space-y-4">
              <p>
                My house is a beautiful mess - six kids racing around and a wife who somehow keeps her cool through it all. When I'm not breaking up arguments over who got more screen time, I help companies figure out their tech problems. Think of me as that friend who tells you when you're about to waste money on gadgets you don't need.
              </p>
            </div>
          </div>
        </div>

        <div className="prose text-gray-600 space-y-4">
          <p>
            I never set out to be a tech consultant, but here we are. While other folks in my field love throwing around fancy terms, I prefer plain talk. After fifteen years of helping companies untangle their tech troubles, I've learned that simple usually works better. If I can't explain it to someone who barely uses a smartphone, it's probably not the right fix.
          </p>

          <p>
            Want to know what really taught me about technology? Managing six kids' worth of devices. Nothing shows you what actually works quite like that. It's the same approach I bring to businesses - if something doesn't make your day easier, why have it? I could go on about AI and cloud systems, but I'd rather focus on what's actually bugging you.
          </p>

          <p>
            Most people find me when they're tired of getting pitched the latest "revolutionary" software. They've sat through endless presentations about game-changing platforms and transformative solutions. What they really want is someone to tell them what's worth their time and what's just expensive fluff.
          </p>

          <p>
            Here's what I've noticed about tech problems: they're usually just regular problems wearing a fancy costume. It's about people needing better ways to work together, teams speaking different languages, and managers trying to pick between too many options. I'm just here to translate the tech speak into something that makes sense.
          </p>

          <p>
            Sometimes I have to be the guy who says, "That expensive system you're looking at? It's like buying a sports car to deliver mail." Other times I'm explaining why the software they're using is giving everyone headaches (and no, it's not because your team isn't smart enough). But every day, it's about keeping things practical and finding solutions that actually work in the real world.
          </p>

          <p>
            I like to think of good technology like a reliable car - it should get you where you need to go without making a fuss. Often, the best advice I can give is showing you which bells and whistles you can safely ignore.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
          <p className="text-gray-600">
            For inquiries or more information, please reach out to me at:
            <br />
            Email: chad.mantooth@pbsnow.com
            <br />
            Phone: 405-205-7804 (text preferred)
          </p>
        </div>
      </div>
    </div>
  );
}