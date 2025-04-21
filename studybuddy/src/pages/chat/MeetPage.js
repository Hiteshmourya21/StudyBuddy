import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const MeetingRoom = () => {
  const { groupId } = useParams();
  const jitsiContainer = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi Meet API is not loaded!");
      return;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: `StudyGroup-${groupId}`,  // Unique room for each group
      width: "100%",
      height: "100vh",
      parentNode: jitsiContainer.current,
      userInfo: {
        displayName: "Your Name",
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    
    api.addEventListener("videoConferenceJoined", (event) => {
      console.log("Meeting joined!", event);
    });

    return () => {
      api.dispose(); // Clean up when leaving the meeting
    };
  }, [groupId]);

  return <div ref={jitsiContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default MeetingRoom;
