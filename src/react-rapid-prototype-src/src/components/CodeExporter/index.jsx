import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './styles.scss';
import useFileGenerator from '../../hooks/useFileGenerator';
import Branch from './Branch';

const CodeExporter = forwardRef((_props, ref) => {
    const [open, setOpen] = useState(false);
    const {fileTree, setFileTree, /** TODO: add 'generate(fileTree)' function */} = useFileGenerator();

    // allow the component to set its own open/close by its parents
    useImperativeHandle(ref, () => {
        return {
            open() {
                setOpen(true);
            }
        }
    });

    // handle direct click of close/cancel
    const handleModalClose = () => {
        setOpen(false);
    };

    // handle "clicking off" outside the dialog
    const handleModalIndirectClose = (evt) => {
        if (evt.target.tagName.toLowerCase() === 'dialog') {
            setOpen(false);
        }
    };

    // handle toggling the "Generate Files" selectors
    const handleFileSelectionChange = (folder, file) => (evt) => {
        setFileTree((currentTree) => {
            const fld = currentTree.findIndex((branch => branch.folder === folder));
            if (fld < 0) {
                return currentTree;
            }
            const fi = currentTree[fld].files.findIndex(branchFile => branchFile.name === file);
            if (fi < 0) {
                return currentTree;
            }
            currentTree[fld].files[fi].selected = evt.target.checked;
            return currentTree;
        });
    };

    // handle triggering the file generation
    const handleSubmit = (evt) => {
        // TODO: replace with call to generate files
        alert(fileTree.reduce((counter, branch) => {
            branch.files.forEach((file) => {
                if (file.selected) {
                    counter++;
                }
            });
            return counter;
        }, 0) + 'files selected');
        evt.preventDefault();
        evt.stopPropagation();
    };

    return (
        <dialog id="export" open={open} onClick={handleModalIndirectClose}>
            <form onSubmit={handleSubmit}>
                <button type="button" className="modal-close" onClick={handleModalClose}><i className="fa-solid fa-xmark"></i></button>
                <h2>Generate Files</h2>
                <p>
                    Turn your virtual project into real, functioning React component stubs.
                    Selected files will be written to the project's "/src" folder.
                </p>
                <figure>
                    <span className="exists">
                        <i className="fa-solid fa-file"></i>
                        File already exists
                    </span>
                    <span>
                        <i className="fa-solid fa-file-medical"></i>
                        File can be generated without overwriting
                    </span>
                </figure>
                <div className="files">
                    <ul>
                        {
                            fileTree.map((branch) => {
                                const folderKey = '_'+branch.folder.split('/').join('')
                                return <Branch key={folderKey} branch={branch} onFileSelectChange={handleFileSelectionChange} />;
                            })
                        }
                    </ul>
                </div>
                <div className="buttons">
                    <button type="reset" onClick={handleModalClose}>Cancel</button>
                    <button type="submit">Generate</button>
                </div>
            </form>
        </dialog>
    );
});

export default CodeExporter;