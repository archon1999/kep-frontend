import { FC, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Swiper from 'shared/components/base/Swiper';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { toast } from 'sonner';
import 'swiper/css';
import { SwiperSlide } from 'swiper/react';
import { useAuth } from 'app/providers/AuthProvider';
import type { ProblemDetail } from '../../../domain/entities/problem.entity';

interface CustomProblemBodyProps {
  problem: ProblemDetail;
}

const randomInt = (lower: number, upper: number) =>
  Math.floor(Math.random() * (upper - lower)) + lower;

const formatTimeParts = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => value.toString().padStart(2, '0');

  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
};

interface CountdownBannerProps {
  durationMs: number;
  onFinish?: () => void;
  resetOnFocusChange?: boolean;
}

const CountdownBanner = ({
  durationMs,
  onFinish,
  resetOnFocusChange = false,
}: CountdownBannerProps) => {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setStartedAt(Date.now());
    setRemainingMs(durationMs);
    setFinished(false);
  }, [durationMs]);

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const rest = Math.max(0, durationMs - elapsed);
      setRemainingMs(rest);
      if (rest <= 0 && !finished) {
        setFinished(true);
        onFinish?.();
      }
    };

    const id = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(id);
  }, [durationMs, finished, onFinish, startedAt]);

  useEffect(() => {
    if (!resetOnFocusChange) return;
    const reset = () => {
      setStartedAt(Date.now());
      setRemainingMs(durationMs);
      setFinished(false);
    };
    window.addEventListener('blur', reset);
    window.addEventListener('focus', reset);
    return () => {
      window.removeEventListener('blur', reset);
      window.removeEventListener('focus', reset);
    };
  }, [durationMs, resetOnFocusChange]);

  const { hours, minutes, seconds } = formatTimeParts(remainingMs);

  return (
    <Box
      sx={{
        background: (theme) =>
          `linear-gradient(90deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.info.main}, ${theme.vars.palette.primary.main})`,
        backgroundSize: '400% 400%',
        animation: 'problem-body-gradient 15s ease infinite',
        borderRadius: 2,
        boxShadow: (theme) => `0 0 5px ${theme.vars.palette.primary.main}`,
        color: 'common.white',
        px: 3,
        py: 2,
        '@keyframes problem-body-gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Stack direction="row" spacing={4} justifyContent="space-between">
        <Stack direction="column" spacing={0.5} alignItems="center">
          <Typography variant="h4" fontWeight={700} color="inherit">
            {hours}
          </Typography>
          <Typography variant="body2" color="inherit">
            Hour
          </Typography>
        </Stack>
        <Stack direction="column" spacing={0.5} alignItems="center">
          <Typography variant="h4" fontWeight={700} color="inherit">
            {minutes}
          </Typography>
          <Typography variant="body2" color="inherit">
            Minute
          </Typography>
        </Stack>
        <Stack direction="column" spacing={0.5} alignItems="center">
          <Typography variant="h4" fontWeight={700} color="inherit">
            {seconds}
          </Typography>
          <Typography variant="body2" color="inherit">
            Second
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

interface HtmlEditorPreviewProps {
  problem: ProblemDetail;
  storageKey: string;
  defaultHtml?: string;
  frameWidth?: number;
  frameHeight?: number;
  overlayColor?: string;
}

const HtmlEditorPreview = ({
  problem,
  storageKey,
  defaultHtml = '',
  frameWidth = 300,
  frameHeight = 300,
  overlayColor,
}: HtmlEditorPreviewProps) => {
  const { mode } = useThemeMode();
  const [html, setHtml] = useState('');
  const [outputHtml, setOutputHtml] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [outputWidth, setOutputWidth] = useState(100);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setHtml(stored ?? defaultHtml ?? '');
  }, [defaultHtml, storageKey, problem.id]);

  useEffect(() => {
    const wrappedHtml = `
      <html style="height: 100%; width: 100%;">
        <body style="overflow: hidden; height: 100%; width: 100%;">
          ${(html ?? '').replace(/<\\s*img/gi, '<imga')}
        </body>
      </html>
    `;
    setOutputHtml(wrappedHtml);
    localStorage.setItem(storageKey, html ?? '');
  }, [html, storageKey]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isHovering) {
      setOutputWidth(100);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const baseWidth = bounds.width || frameWidth || 1;
    const relativeX = event.clientX - bounds.left;
    const percent = Math.max(0, Math.min(100, (relativeX / baseWidth) * 100));
    setOutputWidth(percent);
  };

  const previewWidth = frameWidth;
  const previewHeight = frameHeight;

  return (
    <Stack direction="column" spacing={2}>
      <Editor
        height="400px"
        defaultLanguage="html"
        theme={mode === 'dark' ? 'vs-dark' : 'vs'}
        value={html}
        onChange={(value) => setHtml(value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          automaticLayout: true,
        }}
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Stack direction="column" spacing={1} flex={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Output
          </Typography>
          <Box
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setOutputWidth(100);
            }}
            onMouseMove={handleMouseMove}
            sx={{
              width: previewWidth,
              height: previewHeight,
              position: 'relative',
              cursor: 'col-resize',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                width: `${outputWidth}%`,
                overflow: 'hidden',
                pointerEvents: 'none',
                mixBlendMode: 'normal',
                boxShadow: isHovering ? 'red 1px 0px 0px' : 'none',
                backgroundColor: overlayColor ?? 'inherit',
                zIndex: 1,
              }}
            >
              <Box
                component="iframe"
                srcDoc={outputHtml}
                title="Preview"
                sandbox="allow-same-origin"
                sx={{
                  border: 0,
                  outline: 0,
                  width: previewWidth,
                  height: previewHeight,
                }}
              />
            </Box>
            {problem.image ? (
              <Box
                component="img"
                src={problem.image}
                alt="Target"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: previewWidth,
                  height: previewHeight,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            ) : (
              <Stack
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'background.neutral',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No target image available
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>

        <Stack direction="column" spacing={1} flex={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Target
          </Typography>
          {problem.image ? (
            <Box
              component="img"
              src={problem.image}
              alt="Target reference"
              sx={{
                width: previewWidth,
                height: previewHeight,
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No target image provided.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

const HtmlEditorBody =
  ({
    storageKey,
    frameWidth,
    frameHeight,
    defaultHtml,
    overlayColor,
  }: {
    storageKey: string;
    frameWidth?: number;
    frameHeight?: number;
    defaultHtml?: string;
    overlayColor?: string;
  }) =>
  ({ problem }: CustomProblemBodyProps) => {
    const initialHtml = useMemo(
      () => defaultHtml ?? problem.availableLanguages?.[0]?.codeTemplate ?? '',
      [defaultHtml, problem.availableLanguages],
    );

    return (
      <HtmlEditorPreview
        problem={problem}
        storageKey={storageKey}
        defaultHtml={initialHtml}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
        overlayColor={overlayColor}
      />
    );
  };

const DraggableGridBody = (scriptName: 'problem-1869.js' | 'problem-1905.js') => {
  const scriptId = `custom-grid-${scriptName}`;
  return (_props: CustomProblemBodyProps) => {
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const loadScript = (src: string, id: string) =>
        new Promise<void>((resolve, reject) => {
          if (document.getElementById(id)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.id = id;
          script.onload = () => resolve();
          script.onerror = reject;
          document.body.appendChild(script);
        });

      const load = async () => {
        try {
          await loadScript('https://code.jquery.com/jquery-3.7.1.min.js', 'grid-jquery');
          await loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js',
            'grid-tweenmax',
          );
          await loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js',
            'grid-draggable',
          );
          await loadScript(`/assets/js/${scriptName}`, scriptId);
        } catch (error) {
          console.error('Failed to load grid scripts', error);
        }
      };

      load();

      return () => {
        if (listRef.current) {
          listRef.current.innerHTML = '';
        }
        if ((window as any).tiles) {
          delete (window as any).tiles;
        }
      };
    }, []);

    useEffect(() => {
      const is1905 = scriptName === 'problem-1905.js';
      let shown = false;
      const intervalId = window.setInterval(() => {
        const tiles: any[] = Array.from((window as any).tiles || []);
        if (!tiles.length) return;
        let prevTile: any | null = null;
        let sumL = 0;
        let sumX = 0;
        let ok = true;

        for (const el of tiles) {
          if (prevTile && prevTile.y !== el.tile.y) {
            if (sumL !== 12 || (is1905 && sumX !== 12)) {
              ok = false;
            }
            sumL = 0;
            sumX = 0;
          }
          prevTile = el.tile;
          sumL += el.tile.colspan;
          sumX += el.tile.w ?? 0;
        }

        if (ok && !shown) {
          shown = true;
          const message =
            scriptName === 'problem-1869.js' ? 'Answeris  20232912' : 'Answeris  232912';
          toast.success(message);
        }
      }, 5000);

      return () => window.clearInterval(intervalId);
    }, [scriptName]);

    return (
      <Box
        ref={listRef}
        id="list"
        sx={(theme) => ({
          mt: 2,
          position: 'relative',
          minHeight: 260,
          backgroundColor: 'background.neutral',
          borderRadius: 1,
          overflow: 'hidden',
          '& .tile': {
            position: 'absolute',
            backgroundColor: theme.vars.palette.primary.main,
            color: theme.vars.palette.common.white,
            padding: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: 0.5,
          },
        })}
      />
    );
  };
};

const Problem1615Body: FC<CustomProblemBodyProps> = () => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (btnRef.current) {
        btnRef.current.disabled = true;
      }
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Button
      variant="contained"
      id="mustbeclicked"
      disabled
      onClick={() => console.log('1952')}
      ref={btnRef}
    >
      Click
    </Button>
  );
};

const Problem1623Body: FC<CustomProblemBodyProps> = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      audioRef.current?.play().catch(() => undefined);
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Stack direction="column" spacing={1} alignItems="flex-start">
      <Box
        component="img"
        alt="ugly"
        src="https://www.slashfilm.com/img/gallery/the-good-the-bad-and-the-ugly-ending-explained/intro-1645045469.jpg"
        sx={{ width: 300, borderRadius: 1 }}
      />
      <audio ref={audioRef} src="/assets/audio/the-ugly.weba" />
    </Stack>
  );
};

const Problem1624Body: FC<CustomProblemBodyProps> = () => {
  return (
    <Box
      component="img"
      alt="ugly"
      src="https://images.news18.com/ibnlive/uploads/2021/12/spiderman-meme-16401651614x3.png"
      sx={{ width: 300, borderRadius: 1 }}
    />
  );
};

const Problem1628Body: FC<CustomProblemBodyProps> = () => {
  useEffect(() => {
    console.log('Answer is 1628');
    console.warn('WARNING! Problem #3 eto swap');
  }, []);

  return null;
};

const Problem1630Body: FC<CustomProblemBodyProps> = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const changePosition = () => {
    setPosition({ top: randomInt(1, 500), left: randomInt(1, 500) });
  };

  return (
    <Box sx={{ position: 'relative', height: 540, maxWidth: '100%' }}>
      <Tooltip title="A5k12UIc10">
        <Chip
          color="primary"
          label="Hover"
          onMouseEnter={changePosition}
          sx={{
            position: 'absolute',
            top: position.top,
            left: position.left,
          }}
        />
      </Tooltip>
    </Box>
  );
};

const Problem1631Body: FC<CustomProblemBodyProps> = () => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (btnRef.current) {
        btnRef.current.disabled = true;
      }
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  const handleClick = () => {
    console.log('Clicked! But... to be continued');
    const answer = 'Answer is number of all tags(problemset)';
    if (answer) {
      // noop, just to keep the original intent
    }
  };

  return (
    <Button variant="contained" id="mustbeclicked" disabled onClick={handleClick} ref={btnRef}>
      Click
    </Button>
  );
};

const Problem1633Body: FC<CustomProblemBodyProps> = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      audioRef.current?.play().catch(() => undefined);
    }, 100);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return <audio ref={audioRef} src="/assets/audio/1633.mp3" />;
};

const Problem1634Body: FC<CustomProblemBodyProps> = () => {
  return (
    <Box component="video" controls sx={{ width: 350, borderRadius: 1 }}>
      <source src="/assets/video/1634.mp4" type="video/mp4" />
    </Box>
  );
};

const Problem1635Body: FC<CustomProblemBodyProps> = () => {
  const { currentUser } = useAuth();
  const words = ['har', 'bir', 'odamda', 'bitta', 'bo`lak', 'bo`larklar', 'sonini', 'toping'];

  const index = useMemo(() => {
    const username: string | undefined = currentUser?.username;
    if (!username) return 7;

    let sum = 0;
    for (let i = 0; i < username.length; i++) {
      sum += username.charCodeAt(i);
    }
    return sum % words.length;
  }, [currentUser?.username]);

  return (
    <Typography variant="h6" fontWeight={700}>
      {words[index]}
    </Typography>
  );
};

const Problem1637Body: FC<CustomProblemBodyProps> = () => {
  return <Typography>Masalani sharti yo&apos;qolib qolgan, uni toping.</Typography>;
};

const Problem1638Body: FC<CustomProblemBodyProps> = () => {
  const paragraphs = [
    `Salom. Biz yuqori intellektga ega shaxslarni qidiryapmiz. Buning uchun test ishlab chiqdik.`,
    `Ushbu yerda yashirin xabar bor. Uni toping va u sizga bizni qanday topishni ko'rsatadi.`,
    `Biz hamma yo'lni bosib o'tishga muvaffaq bo'lganlarni kutamiz.`,
    'Omad.',
    '1033',
  ];

  return (
    <Card sx={{ maxWidth: 700 }}>
      <CardHeader
        avatar={
          <Box
            component="img"
            src="https://avatars.dzeninfra.ru/get-zen_doc/759807/pub_5bc971d983474800aa9a3cc6_5bc9720387f84200aa150f11/scale_1200"
            alt=""
            sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 1 }}
          />
        }
      />
      <CardContent>
        <Stack direction="column" spacing={2}>
          {paragraphs.map((text, idx) => (
            <Typography key={idx} sx={{ lineHeight: 1.6 }}>
              {text}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const Problem1639Body: FC<CustomProblemBodyProps> = () => {
  return (
    <CountdownBanner
      durationMs={1000 * 60 * 60}
      onFinish={() => toast.success('Oltinni tagi sabr!')}
    />
  );
};

const Problem1737Body: FC<CustomProblemBodyProps> = () => {
  return (
    <>
      <Button
        id="button1737"
        sx={{ display: 'none' }}
        onClick={() => console.log('Answer: 9731456')}
      />
      <Typography>x</Typography>
    </>
  );
};

const Problem1842Body: FC<CustomProblemBodyProps> = () => {
  const magicString = 'Answer02102023';
  const [magicChar, setMagicChar] = useState('');

  useEffect(() => {
    const handleResize = () => {
      const index = Math.min(
        magicString.length - 1,
        Math.max(0, Math.trunc((window.innerWidth - 200) / 100)),
      );
      setMagicChar(magicString[index] ?? '');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [magicString]);

  return (
    <Typography variant="h4" textAlign="center">
      {magicChar}
    </Typography>
  );
};

const Problem1843Body: FC<CustomProblemBodyProps> = () => {
  const [magicNumber, setMagicNumber] = useState(0);

  useEffect(() => {
    const originalClearInterval = window.clearInterval;
    const originalClearTimeout = window.clearTimeout;

    const noopIntervals: number[] = [];
    for (let i = 1; i <= 100; i++) {
      noopIntervals.push(window.setInterval(() => {}, 10000));
    }

    const intervalId = window.setInterval(() => {
      setMagicNumber(randomInt(1, 9));
    }, 100);

    const logIfMagic = (id: unknown) => {
      if (typeof id === 'number' && id === intervalId) {
        console.log('Answer: 1131');
      }
    };

    window.clearTimeout = (id) => {
      originalClearTimeout(id);
      logIfMagic(id);
    };

    window.clearInterval = (id) => {
      originalClearInterval(id);
      logIfMagic(id);
    };

    return () => {
      noopIntervals.forEach((id) => originalClearInterval(id));
      if (intervalId) {
        originalClearInterval(intervalId);
      }
      window.clearInterval = originalClearInterval;
      window.clearTimeout = originalClearTimeout;
    };
  }, []);

  return (
    <Typography variant="h4" textAlign="center">
      {magicNumber}
    </Typography>
  );
};

const Problem1870Body: FC<CustomProblemBodyProps> = () => {
  const DEFAULT_OUTPUT = `1 240 75 30 0
1 240 75 280 0
1 50 75 30 80
1 50 75 250 80
1 230 75 40 160
1 240 75 280 160
2 270 75 30 0
2 70 75 60 80
2 80 75 100 160
2 70 155 190 80
2 210 75 310 0
2 100 75 310 80
2 120 75 400 160
3 90 55 60 0
3 100 55 90 60
3 400 55 120 120
3 220 55 140 180
4 80 115 180 0
4 40 115 220 120
4 10 43 275 96
4 80 43 290 96
4 15 91 345 144
4 25 43 278 144
4 60 43 280 192
4 250 43 270 0
4 125 43 270 48
5 270 55 30 0
5 30 55 30 60
5 60 55 90 60
5 85 55 35 120
5 70 55 50 180
5 30 175 160 60`;

  type Block = { day: number; height: number; width: number; top: number; left: number };
  const [output, setOutput] = useState(DEFAULT_OUTPUT);
  const [blocks, setBlocks] = useState<Block[][]>(() => Array.from({ length: 7 }, () => []));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const next: Block[][] = Array.from({ length: 7 }, () => []);
      const lines = output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        const [day, height, width, top, left] = line.split(' ');
        const parsed: Block = {
          day: Number(day),
          height: Number(height),
          width: Number(width),
          top: Number(top),
          left: Number(left),
        };
        if (Number.isFinite(parsed.day) && parsed.day >= 1 && parsed.day <= 7) {
          next[parsed.day - 1].push(parsed);
        }
      }
      setBlocks(next);
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [output]);

  const boardHeight = useMemo(() => {
    const max = blocks.flat().reduce((acc, block) => Math.max(acc, block.top + block.height), 0);
    return Math.max(220, max + 20);
  }, [blocks]);

  const timelineMarks = [
    '',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '',
  ];

  return (
    <Stack direction="column" spacing={2}>
      <TextField
        label="Output"
        value={output}
        onChange={(event) => setOutput(event.target.value)}
        fullWidth
        multiline
        minRows={6}
      />

      <Box sx={{ overflowX: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `80px repeat(${blocks.length}, 240px)`,
            gap: 2,
            minWidth: 400,
          }}
        >
          <Stack direction="column" spacing={0.5}>
            {timelineMarks.map((mark, index) => (
              <Typography
                key={index}
                variant="caption"
                color={index % 2 === 0 ? 'text.disabled' : 'text.primary'}
              >
                {mark}
              </Typography>
            ))}
          </Stack>

          {blocks.map((dayBlocks, idx) => (
            <Box
              key={idx}
              sx={(theme) => ({
                position: 'relative',
                height: boardHeight,
                bgcolor: 'background.level1',
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`,
              })}
            >
              {dayBlocks.map((event, eventIdx) => (
                <Box
                  key={`${idx}-${eventIdx}`}
                  sx={{
                    position: 'absolute',
                    top: event.top,
                    left: event.left,
                    height: event.height,
                    width: event.width,
                    bgcolor: 'khaki',
                    border: '1px solid yellowgreen',
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
};

const Problem1903Body: FC<CustomProblemBodyProps> = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 640 }}>
      <Swiper slidesPerView={3} spaceBetween={10} loop>
        {Array.from({ length: 10 }).map((_, index) => (
          <SwiperSlide key={index}>
            <Card
              sx={{
                height: 120,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {index + 1}
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

const Problem1953Body: FC<CustomProblemBodyProps> = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setPosition({ top: randomInt(1, 500), left: randomInt(1, 500) });
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Box sx={{ position: 'relative', height: 540, maxWidth: '100%' }}>
      <Tooltip title="KEPPEK">
        <Chip
          color="primary"
          label="Hover"
          sx={{
            position: 'absolute',
            top: position.top,
            left: position.left,
          }}
        />
      </Tooltip>
    </Box>
  );
};

const Problem1954Body: FC<CustomProblemBodyProps> = () => {
  return (
    <CountdownBanner
      durationMs={1000 * 60 * 60}
      resetOnFocusChange
      onFinish={() => toast.success('Reskep')}
    />
  );
};

const Problem1966Body: FC<CustomProblemBodyProps> = () => {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), 150);
    return () => window.clearTimeout(id);
  }, []);

  if (!visible) return null;

  const lang = (i18n as any)?.language ?? 'en';
  let text = '';
  if (lang.startsWith('uz')) {
    text =
      "getNextMonth nomli funksiya yarating. Funksiya argument sifatida bitta sanani qabul qiladi. Natija sifatida keyingi sanani birinchi kuni bo'lgan sana obyektini qaytaring.";
  } else if (lang.startsWith('ru')) {
    text =
      'Создайте функцию getNextMonth. Функция принимает в качестве аргумента одну дату. В качестве результата возвращает объект даты с первым днем следующего месяца.';
  } else {
    text =
      'Create a getNextMonth function. The function takes one date as an argument. Returns a date object with the first day of the next date as the result.';
  }

  return (
    <Stack direction="column" spacing={1}>
      <Typography>{text}</Typography>
      <Typography
        component="pre"
        sx={{ fontFamily: 'monospace', bgcolor: 'background.level1', p: 1, borderRadius: 1 }}
      >
        {`let date = new Date("2023-02-10");
getNextMonth(date) # 2023-03-01`}
      </Typography>
    </Stack>
  );
};

const CUSTOM_COMPONENTS: Record<number, FC<CustomProblemBodyProps>> = {
  1615: Problem1615Body,
  1623: Problem1623Body,
  1624: Problem1624Body,
  1628: Problem1628Body,
  1630: Problem1630Body,
  1631: Problem1631Body,
  1633: Problem1633Body,
  1634: Problem1634Body,
  1635: Problem1635Body,
  1637: Problem1637Body,
  1638: Problem1638Body,
  1639: Problem1639Body,
  1703: HtmlEditorBody({
    storageKey: 'problem-1703code-editor-codehtml',
    frameWidth: 285,
    frameHeight: 320,
    defaultHtml: `
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<div>
  <h3>Hello, World</h3>
</div>
<style>
  div {
    width: 120%;
    height: 120%;
    margin-top: -2rem;
    margin-left: -2rem;
    background: #7367f0;
  }

  h3 {
    padding: 2rem;
  }
</style>`,
    overlayColor: '#7367f0',
  }),
  1733: HtmlEditorBody({
    storageKey: 'problem-1733code-editor-codehtml',
    frameWidth: 300,
    frameHeight: 300,
  }),
  1734: HtmlEditorBody({
    storageKey: 'problem-1734code-editor-codehtml',
    frameWidth: 285,
    frameHeight: 320,
  }),
  1735: HtmlEditorBody({
    storageKey: 'problem-1735code-editor-codehtml',
    frameWidth: 250,
    frameHeight: 200,
  }),
  1736: HtmlEditorBody({
    storageKey: 'problem-1736code-editor-codehtml',
    frameWidth: 250,
    frameHeight: 200,
    defaultHtml: '',
  }),
  1737: Problem1737Body,
  1739: HtmlEditorBody({
    storageKey: 'template-code-problem-1739-html',
    frameWidth: 300,
    frameHeight: 200,
  }),
  1740: HtmlEditorBody({
    storageKey: 'template-code-problem-1740-html',
    frameWidth: 300,
    frameHeight: 200,
  }),
  1741: HtmlEditorBody({
    storageKey: 'template-code-problem-1741-html',
    frameWidth: 400,
    frameHeight: 200,
  }),
  1742: HtmlEditorBody({
    storageKey: 'template-code-problem-1742-html',
    frameWidth: 400,
    frameHeight: 300,
  }),
  1743: HtmlEditorBody({
    storageKey: 'template-code-problem-1743-html',
    frameWidth: 400,
    frameHeight: 300,
  }),
  1744: HtmlEditorBody({
    storageKey: 'template-code-problem-1744-html',
    frameWidth: 320,
    frameHeight: 240,
  }),
  1840: HtmlEditorBody({
    storageKey: 'template-code-problem-1840-html',
    frameWidth: 300,
    frameHeight: 200,
  }),
  1841: HtmlEditorBody({
    storageKey: 'template-code-problem-1841-html',
    frameWidth: 300,
    frameHeight: 200,
  }),
  1842: Problem1842Body,
  1843: Problem1843Body,
  1869: DraggableGridBody('problem-1869.js'),
  1870: Problem1870Body,
  1903: Problem1903Body,
  1905: DraggableGridBody('problem-1905.js'),
  1953: Problem1953Body,
  1954: Problem1954Body,
  1966: Problem1966Body,
};

export const CustomProblemBody = ({ problem }: CustomProblemBodyProps) => {
  const Component = CUSTOM_COMPONENTS[problem.id];
  if (!Component) return null;

  return <Component problem={problem} />;
};
