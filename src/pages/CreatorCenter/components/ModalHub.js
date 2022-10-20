/*
 * @Date: 2022-10-20 15:09:32
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 17:11:29
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/components/ModalHub.js
 * @Description:
 */

import {Modal} from '~/components/Modal';

export const ModalForCheckSave = (cancel, confirm) => {
    Modal.show({
        content: '已编辑内容是否要保存草稿？下次可继续编辑。',
        cancelText: '不保存草稿',
        confirmText: '保存草稿',
        confirm: true,
        backCloseCallbackExecute: true,
        cancelCallBack: cancel,
        confirmCallBack: confirm,
    });
};
