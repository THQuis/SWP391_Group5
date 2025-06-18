import React, { useState } from "react";
import ProfileOfCoach from "../pages/user/ProfileOfCoach";

export default function WrapperCoachProfile() {
    const [chosenCoachId, setChosenCoachId] = useState(null);
    return (
        <ProfileOfCoach
            currentChosenCoachId={chosenCoachId}
            setChosenCoachId={setChosenCoachId}
        />
    );
}