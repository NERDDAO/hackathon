const submitSection = () => {

    const handleAddTeamMember = () => {
        if (!teamInput) return; // Similar guard
        const newMember = { name: teamInput, email: teamInputEmail, role: teamInputRole }; // Simplify for demonstration
        setFormData({
            ...formData,
            teamMembers: [...formData.teamMembers, newMember],
        });
        setTeamInput("");
        setTeamInputMail("");
        setTeamInputRole(""); // Reset input
    };

    // Handler for text input changes
    const handleHackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHackathonProject({ ...hackathonProject, [name]: value });
    };
    // Handlers for tech stack and team members
    const handleAddTech = () => {
        if (!techInput) return; // Prevent adding empty values
        setHackathonProject({
            ...hackathonProject,
            technologyStack: [...hackathonProject.technologyStack, techInput],
        });
        setTechInput(""); // Reset input
    };


    return (<>
        <div>
            SUBMIT YOUR PROJECT<br />
            <input
                name="projectName"
                onChange={handleHackChange}
                placeholder="Project Name"
                className={"text-black"}
                value={hackathonProject.projectName}
            />
            <input
                name="problemStatement"
                onChange={handleHackChange}
                placeholder="Problem Statement"
                className={"text-black"}
                value={hackathonProject.problemStatement}
            />
            <input
                name="solutionDescription"
                onChange={handleHackChange}
                placeholder="Solution"
                className={"text-black"}
                value={hackathonProject.solutionDescription}
            />
            <input
                name="implementationDescription"
                onChange={handleHackChange}
                placeholder="implementationDescription"
                className={"text-black"}
                value={hackathonProject.implementationDescription}
            />
            {/* Include other inputs similarly */}

            {/* Tech Input */}
            <input
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                className={"text-black"}
                placeholder="Add Technology"
            />

            <button onClick={handleAddTech}>Add Tech</button><br />

            {/* Team Member Input */}
            <input
                value={teamInput}
                onChange={e => setTeamInput(e.target.value)}
                className={"text-black"}
                placeholder="Add Team Member Name"
            />
            <input
                value={teamInputEmail}
                onChange={e => setTeamInputMail(e.target.value)}
                className={"text-black"}
                placeholder="Add Team Member Email"
            />
            <input
                value={teamInputRole}
                onChange={e => setTeamInputRole(e.target.value)}
                className={"text-black"}
                placeholder="Add Team Member Role"
            />
            <button onClick={handleAddTeamMember}>Add Member</button>
            <br />
            {/* Submit Button */}
            <button className={"border-2 text-xl"} onClick={handleSubmit}>
                Submit
            </button>

        </div>






    </>)
};
export default submitSection;
