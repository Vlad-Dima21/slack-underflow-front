import Link from 'next/link';
import React, { useMemo } from 'react';

const ButtonType = {
    get Fill() {
        return 0;
    },
    get Outline() {
        return 1;
    },
    get Text() {
        return 2;
    }
}


const Button = ({ text, onClick, enabled, type, link, className: clsName, formRequired: formSubmit }) => {
    const className = useMemo(() => {
        switch (type) {
            case ButtonType.Fill:
                return enabled ? 'topic-button-selected' : 'topic-button-selected-disabled';
            case ButtonType.Outline:
                return enabled ? 'topic-button' : 'topic-button-disabled';
            case ButtonType.Text:
                return enabled ? 'topic-button-text' : 'topic-button-text';
        }
    }, [enabled, type]);
    const style = useMemo(() => {
        if (clsName) {
            return `${clsName} ${className} rounded-full`;
        }
        return className;
    }, [className]);
    return (
        <>
            {!link ? (
            <button
                className={style}
                onClick={onClick}
                disabled={!enabled}
                type={formSubmit ? 'submit' : undefined}
            >
                {text}
            </button>
            ) : (
                <Link href={link} className={style}>
                    {text}
                </Link>
            )}
        </>
    );
}

export { Button, ButtonType };