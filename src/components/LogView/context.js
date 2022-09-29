/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-28 17:16:32
 */
import React from 'react';

const defaultValue = {register: () => {}};

const context = React.createContext(defaultValue);
context.displayName = 'LogViewContext';

export default context;
