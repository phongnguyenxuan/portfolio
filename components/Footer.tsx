export default function Footer() {
      return (
            <footer className="border-t border-[#2A2F4A] py-12 mt-32">
                  <div className="max-w-[1000px] mx-auto px-8">
                        <p className="text-[#9CA3AF] text-sm text-center flex items-center justify-center gap-2">
                              © Flutter Developer made with
                              <span
                                    className="mx-1 flex items-center text-[#74C0FC]"
                                    aria-label="Flutter logo"
                                    title="Flutter"
                                    role="img"
                              >
                                    <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 640 640"
                                          xmlns="http://www.w3.org/2000/svg"
                                          role="img"
                                          aria-hidden="false"
                                    >
                                          <path
                                                fill="currentColor"
                                                d="M525.5 300.3L387.7 438.1L525.5 576L368 576C331.9 539.9 285.9 493.9 230.1 438.1L368 300.3L525.5 300.3zM368 64L112 320L190.8 398.8L525.5 64L368 64z"
                                          />
                                    </svg>
                              </span>
                              in mind.
                        </p>
                  </div>
            </footer>
      );
}
