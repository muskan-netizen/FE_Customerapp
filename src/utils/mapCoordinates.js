export const parseCoordinateNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (
      trimmedValue === '' ||
      trimmedValue === '0' ||
      trimmedValue === '0.0' ||
      trimmedValue === '0.00' ||
      trimmedValue === '0.00000000'
    ) {
      return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value === 0) {
      return null;
    }

    return value;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue !== 0 ? parsedValue : null;
};

export const isValidCoordinate = ({ latitude, longitude }) => {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude !== 0 &&
    longitude !== 0
  );
};

export const normalizeCoordinate = (point, label = 'coordinate') => {
  const latitude = parseCoordinateNumber(point?.latitude);
  const longitude = parseCoordinateNumber(point?.longitude);

  if (!isValidCoordinate({ latitude, longitude })) {
    console.log('[MapDebug] Invalid coordinate rejected', {
      label,
      latitude: point?.latitude,
      longitude: point?.longitude,
    });
    return null;
  }

  return {
    latitude,
    longitude,
  };
};

export const normalizeTaskCoordinate = (task, index = 0) => {
  const normalizedCoordinate = normalizeCoordinate(task, `task_${index}`);

  if (!normalizedCoordinate) {
    return null;
  }

  return {
    ...task,
    latitude: normalizedCoordinate.latitude,
    longitude: normalizedCoordinate.longitude,
  };
};

export const normalizeTaskList = (tasks = []) => {
  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks
    .map((task, index) => normalizeTaskCoordinate(task, index))
    .filter(Boolean);
};

export const normalizeAgentCoordinate = (agentLocation) => {
  return normalizeCoordinate(
    {
      latitude: agentLocation?.lat,
      longitude: agentLocation?.long ?? agentLocation?.lng,
    },
    'agent_location'
  );
};
