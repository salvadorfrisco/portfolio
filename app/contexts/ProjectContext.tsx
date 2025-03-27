"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface ProjectContextType {
  newProjectButton: boolean;
  toggleNewProjectButton: () => void;
}

interface ProjectProviderProps {
  children: ReactNode;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [newProjectButton, setNewProjectButton] = useState(false);

  const toggleNewProjectButton = () => {
    setNewProjectButton((prev) => !prev);
  };

  return (
    <ProjectContext.Provider
      value={{ newProjectButton, toggleNewProjectButton }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject deve ser usado dentro de um ProjectProvider");
  }
  return context;
}
