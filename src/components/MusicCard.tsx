import { formatDate } from '@/utils/date';

export default function MusicCard({
  sessionId,
  title,
  videoId,
  date,
  participants,
  onClick,
}: {
  sessionId: string;
  title: string;
  videoId: string;
  date: string;
  participants: number;
  onClick: () => void;
}) {
  return (
    <div
      className="flex gap-2 px-2 py-2 items-center cursor-pointer hover:bg-gray-100 rounded-md transition-all"
      onClick={onClick}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Album cover"
        className="w-10 h-10 rounded-sm object-cover"
        style={{ viewTransitionName: `album-art-${sessionId}` }}
      />
      <div className="flex w-full justify-between items-center pl-1.5 pr-2">
        <span className="text-lg font-semibold">{title}</span>
        <div className="flex flex-col items-end">
          <span className="text-sm">
            <strong className="text-md font-semibold">{participants}</strong>명
            출석
          </span>
          <span className="text-xs">{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
}
