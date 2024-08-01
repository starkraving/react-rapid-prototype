import React from 'react';

const Branch = ({branch, onFileSelectChange}) => {
    return (<li>
        <h4>{branch.folder.length && branch.folder || 'root'}</h4>
        <ul>
            {
                branch.files.map((file) => {
                    const fileKey = file.name.split('.').join('');
                    return (<li key={fileKey}>
                        <label className={file.exists ? 'exists' : ''}>
                            <input type='checkbox'
                              defaultChecked={file.selected}
                              onChange={onFileSelectChange(branch.folder, file.name)} />
                            <span>{file.name}</span>
                        </label>
                    </li>)
                })
            }
        </ul>
    </li>)
};

export default Branch;