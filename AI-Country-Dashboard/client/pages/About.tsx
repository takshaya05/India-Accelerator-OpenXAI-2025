export default function About() {
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight">About AI Country Dashboard</h1>

      <div className="mt-4 max-w-3xl space-y-6 text-foreground/80">
        <div>
          <h2 className="text-xl font-semibold text-primary">Mission</h2>
          <p className="mt-2">
            Our goal is to make learning about countries interactive, engaging, and educational for everyone. From
            exploring global data on a 3D globe to interactive quizzes and AI-powered tutoring, we aim to bring the
            world to your fingertips.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary">What We Offer</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">3D Globe Stimulator:</span> Explore countries with real-time data like population, GDP, and climate.
            </li>
            <li>
              <span className="font-medium">Learning Hub:</span> Dive into detailed modules on Geography, History, Economy, and Culture.
            </li>
            <li>
              <span className="font-medium">AI Chat Tutor:</span> Ask questions and get intelligent responses about any country.
            </li>
            <li>
              <span className="font-medium">Quiz & Games:</span> Test your knowledge with quizzes and flag-matching games.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-primary">Connect With Us</h2>
          <p className="mt-2">
            We welcome your feedback and ideas! Reach out via our contact page or follow us on our social media channels.
          </p>
        </div>
      </div>
    </section>
  );
}
