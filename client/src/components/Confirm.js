import { Modal } from 'antd';

const Confirm = (props = {}) => {
  return (
    <Modal
      title={props.title || "Confirmation"}
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
    >
      <p>{props.msg || "Are you sure you want to continue?"}</p>
    </Modal>
  );
};

export default Confirm;