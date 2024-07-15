import React from 'react';

const Branch = ({branch, onFileSelectChange}) => {
    return (<li>
        <h4>{branch.folder}</h4>
        <ul>
            {
                branch.files.map((file) => {
                    const fileKey = file.name.split('.').join('');
                    return (<li key={fileKey}>
                        <label className={file.exists ? 'exists' : ''}>
                            {file.name}
                            <input type='checkbox'
                              defaultChecked={file.selected}
                              onChange={onFileSelectChange(branch.folder, file.name)} />
                        </label>
                    </li>)
                })
            }
        </ul>
    </li>)
};

export default Branch;