import React from 'react';
import SupportOverviewCard from './SupportOverviewCard';

export interface SupportCardData {
  title: string;
  count: number;
  icon?: React.ReactNode;  
  type: string;
}

interface SupportOverviewListProps {
  cards: SupportCardData[];
}

const SupportOverviewList: React.FC<SupportOverviewListProps> = ({ cards }) => {
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {cards.map((card, index) => (
        <SupportOverviewCard
          key={index}
          title={card.title}
          count={card.count}
          icon={card.icon}
          type={card.type}
        />
      ))}
    </div>
  );
};

export default SupportOverviewList;