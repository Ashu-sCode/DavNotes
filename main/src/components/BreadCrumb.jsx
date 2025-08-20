// src/components/Breadcrumb.jsx
import { Link, useLocation, useParams } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const { programName, semester, subject } = useParams();

  const crumbs = [
    { name: "Home", path: "/" },
    programName && { name: programName, path: `/programs/${encodeURIComponent(programName)}` },
    semester && { name: `Semester ${semester}`, path: `/programs/${encodeURIComponent(programName)}/semesters/${semester}` },
    subject && { name: subject, path: `/programs/${encodeURIComponent(programName)}/semesters/${semester}/subjects/${encodeURIComponent(subject)}` },
  ].filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className="text-sm mb-4">
      {crumbs.map((crumb, index) => (
        <span key={crumb.path}>
          <Link
            to={crumb.path}
            className="text-indigo-600 hover:underline"
          >
            {crumb.name}
          </Link>
          {index < crumbs.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
}
