import template from 'lodash/template';
import { repairPath } from '../../utils/fileUtils';
import { path } from '../../utils/electronUtils';
import { format } from '../../export/utils';
import { checkFileExists } from '../utils';

const templateContent = `
import React from 'react';
import PropTypes from 'prop-types';
import s from './<%= componentName %>.module.css';

const placeholderStyle = {
  padding: '1em',
  border: '1px dashed #cccccc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const Placeholder = ({title}) => {
  return (
    <div style={placeholderStyle}>
      <code>
        {title}
      </code>
    </div>
  );
}

const <%= componentName %> = (props) => {
  return (
    <div className={s.root}>
      <div>{props.cell}</div>
    </div>
  );
}

<%= componentName %>.propTypes = {
  cell: PropTypes.element,
};

<%= componentName %>.defaultProps = {
  cell: <Placeholder title="cell" />
};

export default <%= componentName %>;
`;

const templateContentCSS = `
.root {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-rows: minmax(500px, 1fr);
}
`;

export async function createFiles(componentName, dirName, destDirPath, fileExtension) {
  const fileObjects = [];
  let fileExists;
  const componentFilePath = repairPath(path().join(destDirPath, dirName, `${componentName}${fileExtension}`));
  fileExists = await checkFileExists(componentFilePath);
  if (fileExists) {
    throw Error(`The file with the "${componentName}${fileExtension}" name already exists.`);
  }
  const cssFilePath = repairPath(path().join(destDirPath, dirName, `${componentName}.module.css`));
  fileExists = await checkFileExists(cssFilePath);
  if (fileExists) {
    throw Error(`The file with the "${componentName}.module.css" name already exists.`);
  }
  fileObjects.push({
    filePath: componentFilePath,
    fileData: format(template(templateContent)({
      componentName
    }))
  });
  fileObjects.push({
    filePath: cssFilePath,
    fileData: template(templateContentCSS)({
      componentName
    })
  });
  return fileObjects;
}