import { useCallback, useEffect, useRef, useState, Fragment } from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import { TransitionBox } from "@neupauer/transition-box";

// ==================================================
// ===== Helpers ====================================
// ==================================================

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

function useBoolean(initialState = false) {
  const [value, setValue] = useState(initialState);

  const on = useCallback(() => {
    setValue(true);
  }, []);

  const off = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, { on, off, toggle }];
}

// ==================================================
// ===== Example ====================================
// ==================================================

function Notification(props) {
  const [show, { off }] = useBoolean(true);
  useTimeout(off, 5000);

  return (
    <>
      <Transition
        {...props}
        appear
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 delay-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="w-6 h-6 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  Successfully saved!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Anyone with a link can now view this file.
                </p>
              </div>
              <div className="flex flex-shrink-0 ml-4">
                <button
                  className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={off}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

let id = 1;
const genId = () => id++;

export default function Index() {
  const [ids, setIds] = useState([0]);

  const add = useCallback((id) => {
    setIds((previousIds) => [id, ...previousIds]);
  });

  const remove = useCallback((needleId) => {
    setIds((previousIds) =>
      previousIds.filter((haystackId) => haystackId !== needleId)
    );
  });

  return (
    <div className="p-8">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => add(genId())}
      >
        Add Notification
      </button>

      <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          {ids.map((id) => (
            <TransitionBox key={id} duration={500} className="w-full max-w-sm">
              <Notification afterLeave={() => remove(id)} />
            </TransitionBox>
          ))}
        </div>
      </div>
    </div>
  );
}
