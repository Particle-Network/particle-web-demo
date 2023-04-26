import React, { useEffect, useMemo, useState } from 'react';
import { Picker } from 'antd-mobile';
import { Select } from 'antd';
import { DownOutline } from 'antd-mobile-icons';
import './index.scss';
const Option = Select.Option;

export interface PnSelectOption {
    label: string;
    value: any;
    id?: any;
    icon?: string;
    fullname?: string;
}
export interface PnSelectProps {
    onChange?: (value: any) => void;
    options: PnSelectOption[];
    value?: any;
}
function PnSelect(props: PnSelectProps) {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState<(string | null)[]>(['']);

    const showItem = useMemo((): PnSelectOption | undefined => {
        const item = props.options.find((item) => item.value === value);
        return item;
    }, [value]);

    useEffect(() => {
        if (props?.value) {
            setValue(props.value);
        }
    }, [props.value]);
    const columns = [props.options];

    const pickerChange = (e) => {
        const value = e[0];
        setValue(e[0]);
        props?.onChange?.(value);
    };
    const selectChange = (e) => {
        props?.onChange?.(e);
    };
    return (
        <>
            <div className="pc-item-box">
                <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    defaultValue={value}
                    value={value}
                    onChange={selectChange}
                    style={{ width: '100%' }}
                >
                    {props.options.map((chain) => (
                        <Option key={chain.value} value={chain.value} label={chain.label}>
                            <div className="chain-option">
                                {showItem?.icon && <img className="chain-icon" src={chain.icon} alt="" />}
                                <span>{chain.label}</span>
                                <div>{chain.id}</div>
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="pn-select-box">
                <Picker
                    confirmText={'Confirm'}
                    cancelText={'Cancel'}
                    columns={columns}
                    visible={visible}
                    onClose={() => {
                        setVisible(false);
                    }}
                    chain-option // @ts-ignore
                    value={value ? [value] : value}
                    onConfirm={pickerChange}
                />
                <div
                    className="pn-select"
                    onClick={() => {
                        setVisible(true);
                        console.log('open click');
                    }}
                >
                    {/* @ts-ignore */}
                    {showItem?.icon && <img className="option-icon" src={showItem.icon} alt="" />}
                    <span className="itemvalue">
                        {/* @ts-ignore */}
                        {showItem?.label || 'Pleace Select'}
                    </span>
                    {/* @ts-ignore */}
                    {showItem?.id !== undefined ? (
                        <div className="itemid">
                            {showItem.id} <DownOutline />
                        </div>
                    ) : (
                        <div className="itemid">
                            <DownOutline />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default PnSelect;
