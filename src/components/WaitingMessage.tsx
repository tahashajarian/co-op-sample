interface WaitingMessageProps {
  sessionId: string;
}

function WaitingMessage({ sessionId }: WaitingMessageProps) {
  return (
    <div className="text-center">
      <span>Session ID: {sessionId}</span>
      <p className="text-center text-gray-400 italic mt-4 select-none">
        Waiting for another player to join...
      </p>
    </div>
  );
}

export default WaitingMessage;
