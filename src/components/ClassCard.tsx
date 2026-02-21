import { Card, CardContent } from '@/components/ui/card';
import { CircleArrowRight } from 'lucide-react';

export default function ClassCard({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <Card
      className="group cursor-pointer hover:bg-muted transition-colors w-full max-w-sm"
      onClick={onClick}
    >
      <CardContent className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <CircleArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </CardContent>
    </Card>
  );
}
