import {
  AcademicCapIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const TEAM_MEMBERS = [
  {
    name: "Jingyi He",
    handle: "jing2003",
    initials: "JH",
    focus: "Project experience and delivery",
    contribution:
      "Led project coordination and final integration; built project workflows, shared UI and styling patterns, deployment and CI, production API fixes, responsive navigation, and application-wide polish.",
  },
  {
    name: "Bingying Li",
    handle: "bing-ying-li",
    initials: "BL",
    focus: "Locations and character API",
    contribution:
      "Built the location library and location detail experience, implemented the character REST API, and introduced reusable overview components for project and location pages.",
  },
  {
    name: "Adeline Greene",
    handle: "AdelineG218",
    initials: "AG",
    focus: "Scene management",
    contribution:
      "Expanded the scene model and API, then built scene creation, editing, detail, library, and deletion workflows with the fields needed for structured story planning.",
  },
  {
    name: "Abdelrahman Mohamed",
    handle: "fukubie",
    initials: "AM",
    focus: "Shared UI and API foundations",
    contribution:
      "Created reusable loading, error, empty, and not-found states; added the shared API request utility; and implemented backend scene creation, update, and deletion routes.",
  },
  {
    name: "Allen Ramirez",
    handle: "drizzyallen",
    initials: "AR",
    focus: "Database and backend structure",
    contribution:
      "Built reset and seed tooling, early API read routes, location REST routes, project-scoped scene routes, route and controller separation, and scene-character relationship support.",
  },
  {
    name: "Salman Khan",
    handle: "salman-khan03",
    initials: "SK",
    focus: "Character management",
    contribution:
      "Built the character creation and editing forms and added character deletion support to complete the character management workflow.",
  },
];

const TECH_STACK = [
  {
    title: "Frontend",
    description: "React, React Router, Vite, JavaScript, HTML, and CSS",
    icon: CodeBracketIcon,
  },
  {
    title: "Backend",
    description: "Node.js, Express.js, and a RESTful API architecture",
    icon: CircleStackIcon,
  },
  {
    title: "Data",
    description: "PostgreSQL with Neon for persistent hosted data",
    icon: CircleStackIcon,
  },
  {
    title: "Delivery",
    description: "GitHub collaboration, CI checks, and Render deployment",
    icon: CloudArrowUpIcon,
  },
];

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <span className="about-hero__icon" aria-hidden="true">
          <AcademicCapIcon />
        </span>
        <p className="about-eyebrow">About ArcForge</p>
        <h1>Built together as a CodePath WEB103 capstone.</h1>
        <p className="about-hero__description">
          ArcForge is a full-stack story-planning application created for the
          final project in CodePath&apos;s WEB103 Advanced Web Development
          course. Our team built it to help creators organize connected story
          information without relying on scattered documents and spreadsheets.
        </p>
        <div className="about-hero__actions">
          <Link className="primary-button" to="/dashboard">
            Explore ArcForge
            <ArrowRightIcon aria-hidden="true" />
          </Link>
          <a
            className="secondary-button"
            href="https://github.com/arcforge-scenecraft/arcforge"
            target="_blank"
            rel="noreferrer"
          >
            View repository
            <ArrowTopRightOnSquareIcon aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="about-story" aria-labelledby="about-story-title">
        <div className="about-story__content">
          <p className="about-eyebrow">Why we built it</p>
          <h2 id="about-story-title">
            Creative planning has many moving parts.
          </h2>
          <p>
            Stories often begin as notes spread across documents, spreadsheets,
            and conversations. As a project grows, it becomes harder to track
            which characters appear in a scene, where an event happens, how the
            timeline is ordered, and what still needs attention.
          </p>
          <p>
            ArcForge brings those pieces into a structured workspace. Projects,
            scenes, characters, locations, and character appearances can be
            created and reviewed together, giving creators a clearer view of the
            world they are building.
          </p>
        </div>

        <aside className="about-course-card">
          <AcademicCapIcon aria-hidden="true" />
          <p>Course</p>
          <h3>WEB103 Advanced Web Development</h3>
          <span>CodePath final capstone project</span>
        </aside>
      </section>

      <section className="about-section" aria-labelledby="team-title">
        <div className="about-section__header">
          <p className="about-eyebrow">Our collaborators</p>
          <h2 id="team-title">Six contributors, one connected application.</h2>
          <p>
            Contributions below summarize the major areas reflected in the
            project&apos;s merged pull requests and final integration work.
          </p>
        </div>

        <div className="about-team-grid">
          {TEAM_MEMBERS.map((member) => (
            <article className="about-team-card" key={member.handle}>
              <div className="about-team-card__header">
                <span className="about-team-card__avatar" aria-hidden="true">
                  {member.initials}
                </span>
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.focus}</p>
                </div>
              </div>

              <p className="about-team-card__contribution">
                {member.contribution}
              </p>

              <a
                href={`https://github.com/${member.handle}`}
                target="_blank"
                rel="noreferrer"
              >
                @{member.handle}
                <ArrowTopRightOnSquareIcon aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        className="about-section about-stack-section"
        aria-labelledby="stack-title"
      >
        <div className="about-section__header">
          <p className="about-eyebrow">How it was built</p>
          <h2 id="stack-title">A complete client, API, and database stack.</h2>
          <p>
            The capstone gave the team hands-on experience across frontend
            development, backend architecture, database design, collaboration,
            testing workflows, and deployment.
          </p>
        </div>

        <div className="about-stack-grid">
          {TECH_STACK.map((item) => {
            const Icon = item.icon;

            return (
              <article className="about-stack-card" key={item.title}>
                <span aria-hidden="true">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-closing" aria-labelledby="about-closing-title">
        <UserGroupIcon aria-hidden="true" />
        <div>
          <p className="about-eyebrow">See the result</p>
          <h2 id="about-closing-title">Explore the workspace we built.</h2>
          <p>
            Open the project dashboard to review the connected project, scene,
            character, and location workflows.
          </p>
        </div>
        <Link className="primary-button" to="/dashboard">
          View projects
          <ArrowRightIcon aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

export default About;
