/*
 * @Date: 2021-01-07 12:09:49
 * @Description:
 */
/**
 *  Modal.show({ content: '理财魔方', confirm: true }) //confirm为底部有两个按钮
 *  Modal.show({ content: '理财魔方' }) 一个按钮，知道了
 *  Modal.show({
              type: 'image',
              imageUrl:
                  'https://.licaimofang.com/wp-content/uploads/2020/12/银行转稳健弹窗1211.png',
          });
 */
import React from 'react';
import {Keyboard} from 'react-native';
import RootSibling from 'react-native-root-siblings';
import ModalRender from './ModalContainer';
import BottomModal from './BottomModal';
import Mask from '../Mask';
global.rootSibling = null;
export function destroy() {
    if (global.rootSibling) {
        global.rootSibling.destroy();
        global.rootSibling = null;
    }
}
export default class Modal extends React.Component {
    static show(options, type = 'fade') {
        if (global.rootSibling) {
            global.rootSibling.update(
                type === 'fade' ? (
                    <>
                        {<Mask />}
                        <ModalRender {...options} isVisible={true} destroy={() => destroy()} />
                    </>
                ) : type === 'slide' ? (
                    <>
                        <Mask />
                        <BottomModal
                            backdrop={false}
                            destroy={() => destroy()}
                            {...options}
                            ref={(ref) => (this.bottomModal = ref)}
                        />
                    </>
                ) : null
            );
        } else {
            global.rootSibling = new RootSibling(
                type === 'fade' ? (
                    <>
                        {<Mask />}
                        <ModalRender {...options} isVisible={true} destroy={() => destroy()} />
                    </>
                ) : type === 'slide' ? (
                    <>
                        <Mask />
                        <BottomModal
                            backdrop={false}
                            destroy={() => destroy()}
                            {...options}
                            ref={(ref) => (this.bottomModal = ref)}
                        />
                    </>
                ) : null
            );
        }
        setTimeout(() => {
            this.bottomModal && this.bottomModal.show();
        }, 0);
        setTimeout(() => {
            Keyboard.dismiss();
        }, 100);
        return global.rootSibling;
    }
    static close(options, type = 'fade') {
        destroy();
        if (options) {
            if (type === 'fade') {
                global.rootSibling = new RootSibling(
                    <ModalRender {...options} isVisible={false} destroy={() => destroy()} />
                );
            } else {
                global.rootSibling = new RootSibling(
                    (
                        <BottomModal
                            backdrop={false}
                            destroy={() => destroy()}
                            {...options}
                            ref={(ref) => (this.bottomModal = ref)}
                        />
                    )
                );
            }
        } else {
            global.rootSibling = null;
        }
        return global.rootSibling;
    }
    static showLayer(layer) {
        if (global.layer) {
            global.layer.update(layer);
        } else {
            global.layer = new RootSibling(layer);
        }
        return global.layer;
    }
    static hideLayer() {
        if (global.layer) {
            global.layer.destroy();
            global.layer = null;
        }
    }
    componentWillUnmount() {
        destroy();
    }
    render() {
        return null;
    }
}
