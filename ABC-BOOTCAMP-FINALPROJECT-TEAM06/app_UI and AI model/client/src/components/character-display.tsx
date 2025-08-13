import { CharacterState } from "@shared/schema";
import yellowCharacterImg from "@assets/image_1754974772293.png";
import greenCharacterImg from "@assets/image_1754974778652.png";
import redCharacterImg from "@assets/image_1754974783258.png";

interface CharacterDisplayProps {
  characterState?: CharacterState;
  isAnimating: boolean;
}

export default function CharacterDisplay({ characterState, isAnimating }: CharacterDisplayProps) {
  const getCharacterImage = (color?: string) => {
    switch (color) {
      case 'red':
        return redCharacterImg;
      case 'green':
        return greenCharacterImg;
      case 'yellow':
      default:
        return yellowCharacterImg;
    }
  };

  const characterImage = getCharacterImage(characterState?.color);

  return (
    <div className="flex-1 flex items-center justify-center px-8 py-12">
      <div className="relative">
        {/* Character Image */}
        <div 
          className={`character-shadow animate-character-breathe transition-all duration-500 ease-in-out ${
            isAnimating ? 'animate-character-bounce' : ''
          }`}
        >
          <img 
            src={characterImage}
            alt="귀여운 캐릭터"
            className="w-48 h-auto max-w-none"
            style={{ 
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
              imageRendering: 'crisp-edges'
            }}
          />
        </div>

        {/* Character Glow Effect */}
        <div className="absolute inset-0 -z-10 animate-glow rounded-full opacity-20"></div>
      </div>
    </div>
  );
}
