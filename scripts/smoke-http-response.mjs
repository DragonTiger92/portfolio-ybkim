function resolveSameOriginRedirect(currentUrl, response, origin) {
  const location = response.headers.get("location");
  if (location === null) {
    throw new Error(`${currentUrl} returned ${response.status} without a Location header.`);
  }
  const redirectUrl = new URL(location, currentUrl);
  if (redirectUrl.origin !== origin) {
    throw new Error(`Cross-origin smoke-check redirect is not allowed: ${redirectUrl}`);
  }
  return redirectUrl;
}

async function fetchSameOrigin(url, options, redirectCount = 0) {
  if (redirectCount > 5) {
    throw new Error(`Smoke-check redirect limit exceeded for ${url}.`);
  }
  const response = await options.fetchImplementation(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(options.timeoutMilliseconds),
  });
  if (response.status < 300 || response.status >= 400) {
    return response;
  }
  const redirectUrl = resolveSameOriginRedirect(url, response, options.origin);
  return fetchSameOrigin(redirectUrl, options, redirectCount + 1);
}

function validateResponse(response, target) {
  if (response.status !== 200) {
    throw new Error(`${target.path} returned HTTP ${response.status}; expected 200.`);
  }
  const contentType =
    response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
  const expectedTypes = Array.isArray(target.contentType)
    ? target.contentType
    : [target.contentType];
  if (!expectedTypes.includes(contentType)) {
    throw new Error(
      `${target.path} returned Content-Type ${contentType || "(missing)"}; expected ${expectedTypes.join(" or ")}.`,
    );
  }
}

function validateBody(body, target) {
  if (target.marker !== undefined && !body.includes(target.marker)) {
    throw new Error(`${target.path} did not contain the stable marker ${target.marker}.`);
  }
  target.validate?.(body);
}

export async function checkSmokeTarget(target, options) {
  const response = await fetchSameOrigin(new URL(target.path, options.baseUrl), {
    ...options,
    origin: options.baseUrl.origin,
  });
  validateResponse(response, target);
  const body = await response.text();
  await Promise.resolve()
    .then(() => validateBody(body, target))
    .catch((error) => {
      throw new Error(`${target.path} failed content validation: ${error.message}`, {
        cause: error,
      });
    });
}
