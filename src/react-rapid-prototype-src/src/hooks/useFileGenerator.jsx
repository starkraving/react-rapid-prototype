import {useState, useEffect} from 'react';

const useFileGenerator = () => {
    const [fileTree, setFileTree] = useState([]);
    useEffect(() => {
        if (process && process.env && process.env.REACT_APP_SERVER_PORT) {
            fetch('http://localhost:'+process.env.REACT_APP_SERVER_PORT+'/project/files')
                .then(response => response.json())
                .then(data => {
                    setFileTree(data.map((branch) => ({
                        ...branch,
                        files: branch.files.map((file) => ({
                            ...file,
                            selected: file.exists
                        }))
                    })));
                })
                .catch(() => {
                    // do something here
                });
        }
    }, []);
    
    return {fileTree, setFileTree};
}

export default useFileGenerator;