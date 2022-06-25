import { Markup } from 'interweave';

const InstContact = ({infoObj}) => {
  return (
    <div>
      <Markup content={infoObj.about} />
    </div>
  );
};

export default InstContact;
